// ─── ABI ─────────────────────────────────────────────────────────────────────

const IN_EUINT32_COMPONENTS = [
  { internalType: "uint256", name: "ctHash",       type: "uint256" },
  { internalType: "uint8",   name: "securityZone", type: "uint8"   },
  { internalType: "uint8",   name: "utype",        type: "uint8"   },
  { internalType: "bytes",   name: "signature",    type: "bytes"   },
] as const;

const PROPOSAL_VIEW_COMPONENTS = [
  { internalType: "uint256", name: "id",                 type: "uint256"  },
  { internalType: "string",  name: "title",              type: "string"   },
  { internalType: "string",  name: "description",        type: "string"   },
  { internalType: "string",  name: "category",           type: "string"   },
  { internalType: "address", name: "proposer",           type: "address"  },
  { internalType: "uint256", name: "startTime",          type: "uint256"  },
  { internalType: "uint256", name: "endTime",            type: "uint256"  },
  { internalType: "uint256", name: "voterCount",         type: "uint256"  },
  { internalType: "bool",    name: "resolved",           type: "bool"     },
  { internalType: "bool",    name: "resultsPublished",   type: "bool"     },
  { internalType: "bool",    name: "analyticsPublished", type: "bool"     },
  { internalType: "uint256", name: "forVotes",           type: "uint256"  },
  { internalType: "uint256", name: "againstVotes",       type: "uint256"  },
  { internalType: "uint256", name: "abstainVotes",       type: "uint256"  },
  { internalType: "uint256", name: "margin",             type: "uint256"  },
  { internalType: "uint256", name: "totalVotes",         type: "uint256"  },
  { internalType: "bool",    name: "resultsReady",       type: "bool"     },
  { internalType: "bool",    name: "analyticsReady",     type: "bool"     },
] as const;

export const VEILDAO_ABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "got",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "expected",
          "type": "uint8"
        }
      ],
      "name": "InvalidEncryptedInput",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "int32",
          "name": "value",
          "type": "int32"
        }
      ],
      "name": "SecurityZoneOutOfBounds",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "margin",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "totalVotes",
          "type": "uint32"
        }
      ],
      "name": "AnalyticsPublished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "ProposalCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "ProposalResolved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "forVotes",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "againstVotes",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "abstainVotes",
          "type": "uint32"
        }
      ],
      "name": "ResultsPublished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "weight",
          "type": "uint8"
        }
      ],
      "name": "WeightedVoteCast",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "BASE_COST",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encFor",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encAgainst",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encAbstain",
          "type": "tuple"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encFor",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encAgainst",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "ctHash",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "securityZone",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "utype",
              "type": "uint8"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct InEuint32",
          "name": "encAbstain",
          "type": "tuple"
        },
        {
          "internalType": "uint8",
          "name": "weight",
          "type": "uint8"
        }
      ],
      "name": "castWeightedVote",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "durationSeconds",
          "type": "uint256"
        }
      ],
      "name": "createProposal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getProposal",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "proposer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "voterCount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "resultsPublished",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "analyticsPublished",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "forVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "againstVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "abstainVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "margin",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalVotes",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resultsReady",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "analyticsReady",
              "type": "bool"
            }
          ],
          "internalType": "struct GhostGov.ProposalView",
          "name": "v",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "getProposals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "proposer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "voterCount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "resultsPublished",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "analyticsPublished",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "forVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "againstVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "abstainVotes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "margin",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalVotes",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resultsReady",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "analyticsReady",
              "type": "bool"
            }
          ],
          "internalType": "struct GhostGov.ProposalView[]",
          "name": "result",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxVotingDuration",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minVotingDuration",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposalCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "marginPlain",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "marginSig",
          "type": "bytes"
        },
        {
          "internalType": "uint32",
          "name": "totalPlain",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "totalSig",
          "type": "bytes"
        }
      ],
      "name": "publishAnalytics",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "forPlain",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "forSig",
          "type": "bytes"
        },
        {
          "internalType": "uint32",
          "name": "againstPlain",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "againstSig",
          "type": "bytes"
        },
        {
          "internalType": "uint32",
          "name": "abstainPlain",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "abstainSig",
          "type": "bytes"
        }
      ],
      "name": "publishResults",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "resolveProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "min_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "max_",
          "type": "uint256"
        }
      ],
      "name": "setVotingDurationBounds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voteWeight",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voterCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;

// ─── Addresses ────────────────────────────────────────────────────────────────

// Update 421614 to the GhostGov address after running: npx hardhat deploy-ghostgov --network arb-sepolia
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: "0x0000000000000000000000000000000000000000", // eth-sepolia (not deployed)
  421614:   "0x5a9E27c1B1C526Cd4493385D960c1BDaa06239ea", // arb-sepolia — update after GhostGov deploy
};

export function getVeilDAOAddress(chainId: number): `0x${string}` | undefined {
  const addr = CONTRACT_ADDRESSES[chainId];
  return addr && addr !== "0x0000000000000000000000000000000000000000" ? addr : undefined;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Proposal {
  id:                 bigint;
  title:              string;
  description:        string;
  category:           string;
  proposer:           `0x${string}`;
  startTime:          bigint;
  endTime:            bigint;
  voterCount:         bigint;
  resolved:           boolean;
  resultsPublished:   boolean;
  analyticsPublished: boolean;
  forVotes:           bigint;
  againstVotes:       bigint;
  abstainVotes:       bigint;
  margin:             bigint;
  totalVotes:         bigint;
  resultsReady:       boolean;
  analyticsReady:     boolean;
}

export type VoteChoice = "for" | "against" | "abstain";
export type VoteWeight = 1 | 2 | 4;

// Weight schedule: cost = weight² × BASE_COST (0.0001 ETH)
export const WEIGHT_COSTS: Record<VoteWeight, bigint> = {
  1: 0n,                   // free — uses castVote
  2: 400_000_000_000_000n, // 0.0004 ETH
  4: 1_600_000_000_000_000n, // 0.0016 ETH
};

// ─── Demo seed data (shown when no wallet / contract not deployed) ─────────────

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id:                 0n,
    title:              "Allocate 50 ETH to Core Protocol Security Audit",
    description:        "Fund a third-party security audit of the GhostGov FHE voting contracts by Trail of Bits. This will ensure the cryptographic guarantees are sound before mainnet launch.",
    category:           "Security",
    proposer:           "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    startTime:          BigInt(Math.floor(Date.now() / 1000) - 3600),
    endTime:            BigInt(Math.floor(Date.now() / 1000) + 86400 * 2),
    voterCount:         47n,
    resolved:           false,
    resultsPublished:   false,
    analyticsPublished: false,
    forVotes:           0n,
    againstVotes:       0n,
    abstainVotes:       0n,
    margin:             0n,
    totalVotes:         0n,
    resultsReady:       false,
    analyticsReady:     false,
  },
  {
    id:                 1n,
    title:              "Integrate Privara for Private Treasury Execution",
    description:        "After proposals pass, use Privara's SDK to execute treasury payments privately. The amount and recipient remain confidential until funds are distributed, preventing front-running.",
    category:           "Treasury",
    proposer:           "0x1A2b3C4D5E6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
    startTime:          BigInt(Math.floor(Date.now() / 1000) - 7200),
    endTime:            BigInt(Math.floor(Date.now() / 1000) + 86400 * 5),
    voterCount:         123n,
    resolved:           false,
    resultsPublished:   false,
    analyticsPublished: false,
    forVotes:           0n,
    againstVotes:       0n,
    abstainVotes:       0n,
    margin:             0n,
    totalVotes:         0n,
    resultsReady:       false,
    analyticsReady:     false,
  },
  {
    id:                 2n,
    title:              "Grant Program: FHE Developer Ecosystem Fund",
    description:        "Allocate 200 ETH across 10 developer grants for projects building on Fhenix. Grants will be reviewed by a 5-member committee elected via FHE vote.",
    category:           "Community",
    proposer:           "0xDeadBeefDeadBeefDeadBeefDeadBeefDeadBeef",
    startTime:          BigInt(Math.floor(Date.now() / 1000) - 864000),
    endTime:            BigInt(Math.floor(Date.now() / 1000) - 86400),
    voterCount:         312n,
    resolved:           true,
    resultsPublished:   true,
    analyticsPublished: true,
    forVotes:           267n,
    againstVotes:       31n,
    abstainVotes:       14n,
    margin:             236n,
    totalVotes:         312n,
    resultsReady:       true,
    analyticsReady:     true,
  },
];
