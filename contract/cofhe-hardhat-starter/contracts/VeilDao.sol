// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeilDAO
 * @notice Coercion-resistant DAO governance using Fully Homomorphic Encryption.
 *
 * Votes are encrypted client-side and summed homomorphically on-chain.
 * Individual votes are never decryptable — only aggregate totals are revealed
 * after voting ends, making bribery and coercion cryptographically impossible.
 *
 * Vote flow:
 *   1. Voter encrypts (1,0,0) for FOR / (0,1,0) for AGAINST / (0,0,1) for ABSTAIN
 *   2. castVote() homomorphically adds encrypted inputs to running totals
 *   3. resolveProposal() after deadline — marks handles as publicly decryptable
 *   4. publishResults() — anyone provides plaintext + FHE signature to reveal totals
 *   5. getResults() view returns decrypted totals once published
 */
contract VeilDAO is Ownable {

    // ─── Structs ─────────────────────────────────────────────────────────────

    struct Proposal {
        uint256 id;
        string  title;
        string  description;
        string  category;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        euint32 forVotes;
        euint32 againstVotes;
        euint32 abstainVotes;
        bool    resolved;
        bool    resultsPublished;
    }

    struct ProposalView {
        uint256 id;
        string  title;
        string  description;
        string  category;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 voterCount;
        bool    resolved;
        bool    resultsPublished;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool    resultsReady;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    uint256 public proposalCount;
    mapping(uint256 => Proposal)                      private proposals;
    mapping(uint256 => mapping(address => bool))      public  hasVoted;
    mapping(uint256 => uint256)                       public  voterCount;

    uint256 public minVotingDuration = 60;          // 1 minute (testnet-friendly)
    uint256 public maxVotingDuration = 30 days;

    // ─── Events ───────────────────────────────────────────────────────────────

    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        string  title,
        string  category,
        uint256 endTime
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter);
    event ProposalResolved(uint256 indexed proposalId);
    event ResultsPublished(
        uint256 indexed proposalId,
        uint32  forVotes,
        uint32  againstVotes,
        uint32  abstainVotes
    );

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─── Proposal lifecycle ───────────────────────────────────────────────────

    /**
     * @notice Create a new governance proposal.
     * @param title            Short title (shown in UI)
     * @param description      Full proposal text
     * @param category         Tag: "Treasury" | "Protocol" | "Community" | …
     * @param durationSeconds  How long voting is open
     */
    function createProposal(
        string calldata title,
        string calldata description,
        string calldata category,
        uint256         durationSeconds
    ) external returns (uint256 id) {
        require(bytes(title).length > 0,        "Empty title");
        require(
            durationSeconds >= minVotingDuration &&
            durationSeconds <= maxVotingDuration,
            "Invalid duration"
        );

        id = proposalCount++;
        Proposal storage p = proposals[id];
        p.id          = id;
        p.title       = title;
        p.description = description;
        p.category    = category;
        p.proposer    = msg.sender;
        p.startTime   = block.timestamp;
        p.endTime     = block.timestamp + durationSeconds;
        p.forVotes    = FHE.asEuint32(0);
        p.againstVotes= FHE.asEuint32(0);
        p.abstainVotes= FHE.asEuint32(0);

        FHE.allowThis(p.forVotes);
        FHE.allowThis(p.againstVotes);
        FHE.allowThis(p.abstainVotes);

        emit ProposalCreated(id, msg.sender, title, category, p.endTime);
    }

    /**
     * @notice Cast an encrypted vote.
     *
     * @param proposalId   Target proposal
     * @param encFor       Encrypted 1 if voting FOR,     encrypted 0 otherwise
     * @param encAgainst   Encrypted 1 if voting AGAINST, encrypted 0 otherwise
     * @param encAbstain   Encrypted 1 if ABSTAINING,     encrypted 0 otherwise
     *
     * The client must encrypt exactly one value as 1 and the rest as 0.
     * Because the ciphertexts are randomised, an observer cannot determine
     * which field was 1 — this is the FHE coercion-resistance guarantee.
     */
    function castVote(
        uint256         proposalId,
        InEuint32 memory encFor,
        InEuint32 memory encAgainst,
        InEuint32 memory encAbstain
    ) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.startTime,           "Not started");
        require(block.timestamp <  p.endTime,             "Voting ended");
        require(!hasVoted[proposalId][msg.sender],         "Already voted");

        p.forVotes     = FHE.add(p.forVotes,     FHE.asEuint32(encFor));
        p.againstVotes = FHE.add(p.againstVotes, FHE.asEuint32(encAgainst));
        p.abstainVotes = FHE.add(p.abstainVotes, FHE.asEuint32(encAbstain));

        FHE.allowThis(p.forVotes);
        FHE.allowThis(p.againstVotes);
        FHE.allowThis(p.abstainVotes);

        hasVoted[proposalId][msg.sender] = true;
        voterCount[proposalId]++;

        emit VoteCast(proposalId, msg.sender);
    }

    /**
     * @notice Close voting and open encrypted totals for public decryption.
     * Anyone can call this after the voting deadline.
     */
    function resolveProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.endTime, "Voting still active");
        require(!p.resolved,                  "Already resolved");

        p.resolved = true;

        // Allow the Fhenix decryption service (and anyone) to decrypt the totals.
        // The plaintext can only be learned by calling publishResults — the FHE
        // proof-of-correct-decryption ensures nobody can lie about the result.
        FHE.allowPublic(p.forVotes);
        FHE.allowPublic(p.againstVotes);
        FHE.allowPublic(p.abstainVotes);

        emit ProposalResolved(proposalId);
    }

    /**
     * @notice Publish the decrypted vote totals, verified by the FHE signature.
     *
     * After resolveProposal(), anyone can obtain (plaintext, signature) from the
     * Fhenix decryption oracle (via SDK: client.decryptForView + permit) and
     * call this function to permanently record results on-chain.
     */
    function publishResults(
        uint256        proposalId,
        uint32         forPlain,
        bytes memory   forSig,
        uint32         againstPlain,
        bytes memory   againstSig,
        uint32         abstainPlain,
        bytes memory   abstainSig
    ) external {
        Proposal storage p = proposals[proposalId];
        require(p.resolved,           "Not resolved yet");
        require(!p.resultsPublished,  "Already published");

        FHE.publishDecryptResult(p.forVotes,     forPlain,     forSig);
        FHE.publishDecryptResult(p.againstVotes, againstPlain, againstSig);
        FHE.publishDecryptResult(p.abstainVotes, abstainPlain, abstainSig);

        p.resultsPublished = true;

        emit ResultsPublished(proposalId, forPlain, againstPlain, abstainPlain);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /**
     * @notice Get a single proposal including decrypted results (if available).
     */
    function getProposal(uint256 id) external view returns (ProposalView memory v) {
        Proposal storage p = proposals[id];
        (uint256 fv,  bool fReady)  = FHE.getDecryptResultSafe(p.forVotes);
        (uint256 av,  bool aReady)  = FHE.getDecryptResultSafe(p.againstVotes);
        (uint256 abv, bool abReady) = FHE.getDecryptResultSafe(p.abstainVotes);

        v = ProposalView({
            id:               p.id,
            title:            p.title,
            description:      p.description,
            category:         p.category,
            proposer:         p.proposer,
            startTime:        p.startTime,
            endTime:          p.endTime,
            voterCount:       voterCount[id],
            resolved:         p.resolved,
            resultsPublished: p.resultsPublished,
            forVotes:         fv,
            againstVotes:     av,
            abstainVotes:     abv,
            resultsReady:     fReady && aReady && abReady
        });
    }

    /**
     * @notice Paginated proposal list for the UI.
     */
    function getProposals(
        uint256 offset,
        uint256 limit
    ) external view returns (ProposalView[] memory result) {
        uint256 total = proposalCount;
        if (offset >= total) return result;
        uint256 end  = offset + limit > total ? total : offset + limit;
        result = new ProposalView[](end - offset);

        for (uint256 i = 0; i < result.length; i++) {
            uint256 pid = offset + i;
            Proposal storage p = proposals[pid];
            (uint256 fv,  bool fReady)  = FHE.getDecryptResultSafe(p.forVotes);
            (uint256 av,  bool aReady)  = FHE.getDecryptResultSafe(p.againstVotes);
            (uint256 abv, bool abReady) = FHE.getDecryptResultSafe(p.abstainVotes);

            result[i] = ProposalView({
                id:               p.id,
                title:            p.title,
                description:      p.description,
                category:         p.category,
                proposer:         p.proposer,
                startTime:        p.startTime,
                endTime:          p.endTime,
                voterCount:       voterCount[pid],
                resolved:         p.resolved,
                resultsPublished: p.resultsPublished,
                forVotes:         fv,
                againstVotes:     av,
                abstainVotes:     abv,
                resultsReady:     fReady && aReady && abReady
            });
        }
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setVotingDurationBounds(uint256 min_, uint256 max_) external onlyOwner {
        require(min_ > 0 && max_ >= min_, "Invalid bounds");
        minVotingDuration = min_;
        maxVotingDuration = max_;
    }
}
