// ─── ABI ─────────────────────────────────────────────────────────────────────

export const VEILDAO_ABI = [
  // Write
  {
    name: "createProposal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title",            type: "string"  },
      { name: "description",      type: "string"  },
      { name: "category",         type: "string"  },
      { name: "durationSeconds",  type: "uint256" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    name: "castVote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "encFor",     type: "tuple", components: [{ name: "data", type: "bytes" }] },
      { name: "encAgainst", type: "tuple", components: [{ name: "data", type: "bytes" }] },
      { name: "encAbstain", type: "tuple", components: [{ name: "data", type: "bytes" }] },
    ],
    outputs: [],
  },
  {
    name: "resolveProposal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "publishResults",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId",   type: "uint256" },
      { name: "forPlain",     type: "uint32"  },
      { name: "forSig",       type: "bytes"   },
      { name: "againstPlain", type: "uint32"  },
      { name: "againstSig",   type: "bytes"   },
      { name: "abstainPlain", type: "uint32"  },
      { name: "abstainSig",   type: "bytes"   },
    ],
    outputs: [],
  },
  // Read
  {
    name: "proposalCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "hasVoted",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "voter",      type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "voterCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getProposal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id",               type: "uint256" },
          { name: "title",            type: "string"  },
          { name: "description",      type: "string"  },
          { name: "category",         type: "string"  },
          { name: "proposer",         type: "address" },
          { name: "startTime",        type: "uint256" },
          { name: "endTime",          type: "uint256" },
          { name: "voterCount",       type: "uint256" },
          { name: "resolved",         type: "bool"    },
          { name: "resultsPublished", type: "bool"    },
          { name: "forVotes",         type: "uint256" },
          { name: "againstVotes",     type: "uint256" },
          { name: "abstainVotes",     type: "uint256" },
          { name: "resultsReady",     type: "bool"    },
        ],
      },
    ],
  },
  {
    name: "getProposals",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "offset", type: "uint256" },
      { name: "limit",  type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id",               type: "uint256" },
          { name: "title",            type: "string"  },
          { name: "description",      type: "string"  },
          { name: "category",         type: "string"  },
          { name: "proposer",         type: "address" },
          { name: "startTime",        type: "uint256" },
          { name: "endTime",          type: "uint256" },
          { name: "voterCount",       type: "uint256" },
          { name: "resolved",         type: "bool"    },
          { name: "resultsPublished", type: "bool"    },
          { name: "forVotes",         type: "uint256" },
          { name: "againstVotes",     type: "uint256" },
          { name: "abstainVotes",     type: "uint256" },
          { name: "resultsReady",     type: "bool"    },
        ],
      },
    ],
  },
  // Events
  {
    name: "ProposalCreated",
    type: "event",
    inputs: [
      { name: "id",       type: "uint256", indexed: true  },
      { name: "proposer", type: "address", indexed: true  },
      { name: "title",    type: "string",  indexed: false },
      { name: "category", type: "string",  indexed: false },
      { name: "endTime",  type: "uint256", indexed: false },
    ],
  },
  {
    name: "VoteCast",
    type: "event",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "voter",      type: "address", indexed: true },
    ],
  },
  {
    name: "ProposalResolved",
    type: "event",
    inputs: [{ name: "proposalId", type: "uint256", indexed: true }],
  },
  {
    name: "ResultsPublished",
    type: "event",
    inputs: [
      { name: "proposalId",   type: "uint256", indexed: true  },
      { name: "forVotes",     type: "uint32",  indexed: false },
      { name: "againstVotes", type: "uint32",  indexed: false },
      { name: "abstainVotes", type: "uint32",  indexed: false },
    ],
  },
] as const;

// ─── Addresses ────────────────────────────────────────────────────────────────

export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  // Fhenix Helium Testnet (deployed after running: pnpm task:deploy-veildao --network eth-sepolia)
  11155111: "0x0000000000000000000000000000000000000000", // eth-sepolia — replace after deploy
  421614:   "0x0000000000000000000000000000000000000000", // arb-sepolia — replace after deploy
};

export function getVeilDAOAddress(chainId: number): `0x${string}` | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Proposal {
  id:               bigint;
  title:            string;
  description:      string;
  category:         string;
  proposer:         `0x${string}`;
  startTime:        bigint;
  endTime:          bigint;
  voterCount:       bigint;
  resolved:         boolean;
  resultsPublished: boolean;
  forVotes:         bigint;
  againstVotes:     bigint;
  abstainVotes:     bigint;
  resultsReady:     boolean;
}

export type VoteChoice = "for" | "against" | "abstain";

// ─── Demo seed data (shown when no wallet / contract not deployed) ─────────────

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id:               0n,
    title:            "Allocate 50 ETH to Core Protocol Security Audit",
    description:      "Fund a third-party security audit of the VeilDAO FHE voting contracts by Trail of Bits. This will ensure the cryptographic guarantees are sound before mainnet launch.",
    category:         "Security",
    proposer:         "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    startTime:        BigInt(Math.floor(Date.now() / 1000) - 3600),
    endTime:          BigInt(Math.floor(Date.now() / 1000) + 86400 * 2),
    voterCount:       47n,
    resolved:         false,
    resultsPublished: false,
    forVotes:         0n,
    againstVotes:     0n,
    abstainVotes:     0n,
    resultsReady:     false,
  },
  {
    id:               1n,
    title:            "Integrate Privara for Private Treasury Execution",
    description:      "After proposals pass, use Privara's SDK to execute treasury payments privately. The amount and recipient remain confidential until funds are distributed, preventing front-running.",
    category:         "Treasury",
    proposer:         "0x1A2b3C4D5E6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
    startTime:        BigInt(Math.floor(Date.now() / 1000) - 7200),
    endTime:          BigInt(Math.floor(Date.now() / 1000) + 86400 * 5),
    voterCount:       123n,
    resolved:         false,
    resultsPublished: false,
    forVotes:         0n,
    againstVotes:     0n,
    abstainVotes:     0n,
    resultsReady:     false,
  },
  {
    id:               2n,
    title:            "Grant Program: FHE Developer Ecosystem Fund",
    description:      "Allocate 200 ETH across 10 developer grants for projects building on Fhenix. Grants will be reviewed by a 5-member committee elected via FHE vote.",
    category:         "Community",
    proposer:         "0xDeadBeefDeadBeefDeadBeefDeadBeefDeadBeef",
    startTime:        BigInt(Math.floor(Date.now() / 1000) - 864000),
    endTime:          BigInt(Math.floor(Date.now() / 1000) - 86400),
    voterCount:       312n,
    resolved:         true,
    resultsPublished: true,
    forVotes:         267n,
    againstVotes:     31n,
    abstainVotes:     14n,
    resultsReady:     true,
  },
];
