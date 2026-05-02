// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GhostGov is Ownable {

    // ─── Cost schedule for quadratic voting ──────────────────────────────────

    uint256 public constant BASE_COST = 0.0001 ether; // weight-1 baseline (testnet)

    // ─── Structs ─────────────────────────────────────────────────────────────

    struct Proposal {
        uint256 id;
        string  title;
        string  description;
        string  category;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        // Encrypted vote tallies (homomorphically accumulated)
        euint32 forVotes;
        euint32 againstVotes;
        euint32 abstainVotes;
        // FHE analytics — computed at resolution on encrypted data
        euint32 encMargin;       // FHE.sub(forVotes, againstVotes)
        euint32 encTotalVotes;   // FHE.add(for + against + abstain)
        bool    resolved;
        bool    resultsPublished;
        bool    analyticsPublished;
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
        bool    analyticsPublished;
        // Decrypted results (only populated after publishResults / publishAnalytics)
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 margin;          // |forVotes - againstVotes|
        uint256 totalVotes;      // for + against + abstain
        bool    resultsReady;
        bool    analyticsReady;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    uint256 public proposalCount;
    mapping(uint256 => Proposal)                      private proposals;
    mapping(uint256 => mapping(address => bool))      public  hasVoted;
    mapping(uint256 => mapping(address => uint8))     public  voteWeight;
    mapping(uint256 => uint256)                       public  voterCount;

    uint256 public minVotingDuration = 60;
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
    event WeightedVoteCast(uint256 indexed proposalId, address indexed voter, uint8 weight);
    event ProposalResolved(uint256 indexed proposalId);
    event ResultsPublished(
        uint256 indexed proposalId,
        uint32  forVotes,
        uint32  againstVotes,
        uint32  abstainVotes
    );
    event AnalyticsPublished(
        uint256 indexed proposalId,
        uint32  margin,
        uint32  totalVotes
    );

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─── Proposal lifecycle ───────────────────────────────────────────────────

    function createProposal(
        string calldata title,
        string calldata description,
        string calldata category,
        uint256         durationSeconds
    ) external returns (uint256 id) {
        require(bytes(title).length > 0, "Empty title");
        require(
            durationSeconds >= minVotingDuration &&
            durationSeconds <= maxVotingDuration,
            "Invalid duration"
        );

        id = proposalCount++;
        Proposal storage p = proposals[id];
        p.id           = id;
        p.title        = title;
        p.description  = description;
        p.category     = category;
        p.proposer     = msg.sender;
        p.startTime    = block.timestamp;
        p.endTime      = block.timestamp + durationSeconds;
        p.forVotes     = FHE.asEuint32(0);
        p.againstVotes = FHE.asEuint32(0);
        p.abstainVotes = FHE.asEuint32(0);

        FHE.allowThis(p.forVotes);
        FHE.allowThis(p.againstVotes);
        FHE.allowThis(p.abstainVotes);

        emit ProposalCreated(id, msg.sender, title, category, p.endTime);
    }

    /**
     * @notice Cast an encrypted vote with weight 1 (free).
     * Encrypt (1,0,0) for FOR | (0,1,0) for AGAINST | (0,0,1) for ABSTAIN.
     */
    function castVote(
        uint256          proposalId,
        InEuint32 memory encFor,
        InEuint32 memory encAgainst,
        InEuint32 memory encAbstain
    ) external {
        _applyVote(proposalId, encFor, encAgainst, encAbstain);
        voteWeight[proposalId][msg.sender] = 1;
        emit VoteCast(proposalId, msg.sender);
    }


    /**
     * @notice Cast an encrypted vote with quadratic weight.
     *
     * Weight schedule:
     *   weight 1 → cost 0.0001 ETH  (1 × BASE_COST)
     *   weight 2 → cost 0.0004 ETH  (4 × BASE_COST)
     *   weight 4 → cost 0.0016 ETH  (16 × BASE_COST)
     *
     * The voter encrypts (weight,0,0)/(0,weight,0)/(0,0,weight).
     * The weight is revealed by the payment but the DIRECTION remains hidden.
     * This preserves coercion-resistance while enabling proportional influence.
     */
    function castWeightedVote(
        uint256          proposalId,
        InEuint32 memory encFor,
        InEuint32 memory encAgainst,
        InEuint32 memory encAbstain,
        uint8            weight
    ) external payable {
        require(weight == 1 || weight == 2 || weight == 4, "Weight: 1, 2 or 4");
        uint256 cost = uint256(weight) * uint256(weight) * BASE_COST;
        require(msg.value == cost, "Incorrect payment for weight");

        _applyVote(proposalId, encFor, encAgainst, encAbstain);
        voteWeight[proposalId][msg.sender] = weight;
        emit WeightedVoteCast(proposalId, msg.sender, weight);
    }

    function _applyVote(
        uint256          proposalId,
        InEuint32 memory encFor,
        InEuint32 memory encAgainst,
        InEuint32 memory encAbstain
    ) internal {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.startTime, "Not started");
        require(block.timestamp <  p.endTime,   "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        p.forVotes     = FHE.add(p.forVotes,     FHE.asEuint32(encFor));
        p.againstVotes = FHE.add(p.againstVotes, FHE.asEuint32(encAgainst));
        p.abstainVotes = FHE.add(p.abstainVotes, FHE.asEuint32(encAbstain));

        FHE.allowThis(p.forVotes);
        FHE.allowThis(p.againstVotes);
        FHE.allowThis(p.abstainVotes);

        hasVoted[proposalId][msg.sender] = true;
        voterCount[proposalId]++;
    }


    /**
     * @notice Close voting and compute FHE analytics on encrypted tallies.
     *
     * Two analytics are computed entirely on ciphertext — no decryption here:
     *   encMargin     = FHE.sub(forVotes, againstVotes)   — encrypted winning margin
     *   encTotalVotes = FHE.add(for + against + abstain)  — encrypted turnout
     *
     * Both are opened for public decryption so the oracle can later publish them.
     */
    function resolveProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.endTime, "Voting still active");
        require(!p.resolved,                  "Already resolved");

        p.resolved = true;

        // ── FHE analytics ────────────────────────────────────────────────────
        // These operations execute on encrypted data — the EVM sees no plaintext.
        p.encMargin     = FHE.sub(p.forVotes, p.againstVotes);
        p.encTotalVotes = FHE.add(FHE.add(p.forVotes, p.againstVotes), p.abstainVotes);

        FHE.allowThis(p.encMargin);
        FHE.allowThis(p.encTotalVotes);

        // Open all handles for oracle decryption
        FHE.allowPublic(p.forVotes);
        FHE.allowPublic(p.againstVotes);
        FHE.allowPublic(p.abstainVotes);
        FHE.allowPublic(p.encMargin);
        FHE.allowPublic(p.encTotalVotes);

        emit ProposalResolved(proposalId);
    }

    /**
     * @notice Publish verifiable decrypted vote totals (FHE-signed).
     */
    function publishResults(
        uint256      proposalId,
        uint32       forPlain,
        bytes memory forSig,
        uint32       againstPlain,
        bytes memory againstSig,
        uint32       abstainPlain,
        bytes memory abstainSig
    ) external {
        Proposal storage p = proposals[proposalId];
        require(p.resolved,          "Not resolved yet");
        require(!p.resultsPublished, "Already published");

        FHE.publishDecryptResult(p.forVotes,     forPlain,     forSig);
        FHE.publishDecryptResult(p.againstVotes, againstPlain, againstSig);
        FHE.publishDecryptResult(p.abstainVotes, abstainPlain, abstainSig);

        p.resultsPublished = true;
        emit ResultsPublished(proposalId, forPlain, againstPlain, abstainPlain);
    }

    /**
     * @notice Publish the FHE-computed analytics (margin and turnout).
     * Margin wraps on underflow — a value > 2^31 means AGAINST leads.
     */
    function publishAnalytics(
        uint256      proposalId,
        uint32       marginPlain,
        bytes memory marginSig,
        uint32       totalPlain,
        bytes memory totalSig
    ) external {
        Proposal storage p = proposals[proposalId];
        require(p.resolved,             "Not resolved yet");
        require(!p.analyticsPublished,  "Already published");

        FHE.publishDecryptResult(p.encMargin,     marginPlain, marginSig);
        FHE.publishDecryptResult(p.encTotalVotes, totalPlain,  totalSig);

        p.analyticsPublished = true;
        emit AnalyticsPublished(proposalId, marginPlain, totalPlain);
    }


    function getProposal(uint256 id) external view returns (ProposalView memory v) {
        Proposal storage p = proposals[id];
        (uint256 fv,  bool fReady)  = FHE.getDecryptResultSafe(p.forVotes);
        (uint256 av,  bool aReady)  = FHE.getDecryptResultSafe(p.againstVotes);
        (uint256 abv, bool abReady) = FHE.getDecryptResultSafe(p.abstainVotes);
        (uint256 mg,  bool mgReady) = FHE.getDecryptResultSafe(p.encMargin);
        (uint256 tv,  bool tvReady) = FHE.getDecryptResultSafe(p.encTotalVotes);

        v = ProposalView({
            id:                 p.id,
            title:              p.title,
            description:        p.description,
            category:           p.category,
            proposer:           p.proposer,
            startTime:          p.startTime,
            endTime:            p.endTime,
            voterCount:         voterCount[id],
            resolved:           p.resolved,
            resultsPublished:   p.resultsPublished,
            analyticsPublished: p.analyticsPublished,
            forVotes:           fv,
            againstVotes:       av,
            abstainVotes:       abv,
            margin:             mg,
            totalVotes:         tv,
            resultsReady:       fReady && aReady && abReady,
            analyticsReady:     mgReady && tvReady
        });
    }

    function getProposals(
        uint256 offset,
        uint256 limit
    ) external view returns (ProposalView[] memory result) {
        uint256 total = proposalCount;
        if (offset >= total) return result;
        uint256 end = offset + limit > total ? total : offset + limit;
        result = new ProposalView[](end - offset);

        for (uint256 i = 0; i < result.length; i++) {
            uint256 pid = offset + i;
            Proposal storage p = proposals[pid];
            (uint256 fv,  bool fReady)  = FHE.getDecryptResultSafe(p.forVotes);
            (uint256 av,  bool aReady)  = FHE.getDecryptResultSafe(p.againstVotes);
            (uint256 abv, bool abReady) = FHE.getDecryptResultSafe(p.abstainVotes);
            (uint256 mg,  bool mgReady) = FHE.getDecryptResultSafe(p.encMargin);
            (uint256 tv,  bool tvReady) = FHE.getDecryptResultSafe(p.encTotalVotes);

            result[i] = ProposalView({
                id:                 p.id,
                title:              p.title,
                description:        p.description,
                category:           p.category,
                proposer:           p.proposer,
                startTime:          p.startTime,
                endTime:            p.endTime,
                voterCount:         voterCount[pid],
                resolved:           p.resolved,
                resultsPublished:   p.resultsPublished,
                analyticsPublished: p.analyticsPublished,
                forVotes:           fv,
                againstVotes:       av,
                abstainVotes:       abv,
                margin:             mg,
                totalVotes:         tv,
                resultsReady:       fReady && aReady && abReady,
                analyticsReady:     mgReady && tvReady
            });
        }
    }


    function setVotingDurationBounds(uint256 min_, uint256 max_) external onlyOwner {
        require(min_ > 0 && max_ >= min_, "Invalid bounds");
        minVotingDuration = min_;
        maxVotingDuration = max_;
    }

    function withdraw() external onlyOwner {
        (bool ok,) = msg.sender.call{value: address(this).balance}("");
        require(ok, "Transfer failed");
    }
}
