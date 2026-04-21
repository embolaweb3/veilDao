// ─── ABI ─────────────────────────────────────────────────────────────────────

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
              "internalType": "bool",
              "name": "resultsReady",
              "type": "bool"
            }
          ],
          "internalType": "struct VeilDAO.ProposalView",
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
              "internalType": "bool",
              "name": "resultsReady",
              "type": "bool"
            }
          ],
          "internalType": "struct VeilDAO.ProposalView[]",
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
    }
  ] as const;

// ─── Addresses ────────────────────────────────────────────────────────────────

export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: "0x0000000000000000000000000000000000000000", // eth-sepolia
  421614:   "0xdE21971e44DB426b87B17C40eaC54E212bdCa7EB", // arb-sepolia
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
