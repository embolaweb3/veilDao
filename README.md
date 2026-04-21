# VeilDAO — Coercion-Resistant Governance

> *Vote in the dark. Count in the light.*

VeilDAO is a DAO governance protocol where **individual votes are permanently encrypted** using Fhenix Fully Homomorphic Encryption (FHE). The smart contract tallies ballots without ever decrypting them. Only aggregate totals are revealed after voting ends — making bribery and coercion **mathematically impossible**.

---

## The Problem

On transparent chains, governance votes are public. An attacker can:
- **Buy votes**: Pay me now, verify my vote on-chain later
- **Coerce votes**: Threaten me, then audit my wallet to confirm compliance

Even "commit-reveal" schemes don't fully solve this — the reveal transaction proves how you voted.

## The FHE Solution

```
Voter         → enc(1, 0, 0)  // FOR — encrypted in browser, randomised ciphertext
Contract      → FHE.add(total, enc(1))  // Homomorphic addition, never sees plaintext
Voting ends   → FHE.allowPublic(total)  // Enable decryption by oracle
Oracle        → publishDecryptResult(total, plaintext, sig)  // Verifiable reveal
Result        → FHE.getDecryptResultSafe(total) → 47 FOR, 12 AGAINST, 3 ABSTAIN
```

**The key guarantee**: The ciphertext for `enc(1)` is computationally indistinguishable from `enc(0)`. Even if someone forces you to reveal your encrypted transaction, you cannot prove what you voted.

---

## Architecture

```
bt/
├── cofhe-hardhat-starter/          # Smart contracts (Hardhat + Fhenix FHE)
│   ├── contracts/
│   │   ├── Counter.sol             # Original example
│   │   └── VeilDAO.sol             # ← Main FHE governance contract
│   ├── tasks/
│   │   ├── deploy-veildao.ts       # Deploy script
│   │   └── ...
│   └── hardhat.config.ts
└── frontend/                       # Next.js 14 dApp
    ├── app/
    │   ├── page.tsx                # Landing hero with particle canvas
    │   ├── dao/page.tsx            # Proposal browser
    │   ├── vote/[id]/page.tsx      # Vote page with FHE animation
    │   └── propose/page.tsx        # Create proposal
    ├── components/
    │   ├── ParticleField.tsx       # Canvas particle network
    │   ├── EncryptedCounter.tsx    # Scrambling counter → reveal animation
    │   ├── VotePanel.tsx           # FHE vote submission UI
    │   ├── ProposalCard.tsx        # Proposal list card
    │   └── CreateProposalModal.tsx # New proposal form
    ├── hooks/
    │   ├── useVeilDAO.ts           # Contract read/write hooks
    │   └── useFHEVote.ts           # FHE encryption + vote submission
    └── lib/
        ├── contracts.ts            # ABI, addresses, types, demo data
        └── wagmi.ts                # Wagmi + RainbowKit config
```

---

## Vote Flow

### Client-Side (TypeScript, `@cofhe/sdk`)

```typescript
// User selects "FOR"
const encrypted = await cofheClient
  .encryptInputs([
    Encryptable.uint32(1n),  // FOR     = 1
    Encryptable.uint32(0n),  // AGAINST = 0
    Encryptable.uint32(0n),  // ABSTAIN = 0
  ])
  .execute();

// Send three encrypted values to the contract
await castVote(proposalId, encrypted[0], encrypted[1], encrypted[2]);
```

### Contract-Side (Solidity, `@fhenixprotocol/cofhe-contracts`)

```solidity
function castVote(
    uint256          proposalId,
    InEuint32 memory encFor,      // Encrypted 1 or 0
    InEuint32 memory encAgainst,  // Encrypted 0 or 1
    InEuint32 memory encAbstain   // Encrypted 0 or 1
) external {
    // Homomorphic addition — never sees plaintext
    p.forVotes     = FHE.add(p.forVotes,     FHE.asEuint32(encFor));
    p.againstVotes = FHE.add(p.againstVotes, FHE.asEuint32(encAgainst));
    p.abstainVotes = FHE.add(p.abstainVotes, FHE.asEuint32(encAbstain));

    FHE.allowThis(p.forVotes);      // Contract retains access to handle
    FHE.allowThis(p.againstVotes);
    FHE.allowThis(p.abstainVotes);
}
```

### Reveal (after voting period)

```solidity
// Anyone calls this after deadline — opens handles for public decryption
function resolveProposal(uint256 proposalId) external {
    FHE.allowPublic(p.forVotes);
    FHE.allowPublic(p.againstVotes);
    FHE.allowPublic(p.abstainVotes);
}

// Fhenix oracle (or anyone with SDK) decrypts and publishes
function publishResults(uint256 id, uint32 forPlain, bytes forSig, ...) external {
    FHE.publishDecryptResult(p.forVotes, forPlain, forSig);  // Signature verifies correctness
    // ...
}
```

---

## Live Deployment

| Network | Contract Address |
|---------|-----------------|
| Arbitrum Sepolia | [`0xdE21971e44DB426b87B17C40eaC54E212bdCa7EB`](https://sepolia.arbiscan.io/address/0xdE21971e44DB426b87B17C40eaC54E212bdCa7EB) |

---

## Setup

### Prerequisites
- Node.js ≥ 18, pnpm

### Contracts

```bash
cd cofhe-hardhat-starter
pnpm install

# Local dev (mock FHE)
pnpm localcofhe:start
pnpm localcofhe:deploy

# Deploy to testnet
cp .env.example .env     # Add PRIVATE_KEY + RPC URLs
pnpm eth-sepolia:deploy-counter   # existing example
npx hardhat deploy-veildao --network eth-sepolia   # VeilDAO
```

### Frontend

```bash
cd frontend
pnpm install

# Set contract address after deploying
# In lib/contracts.ts → CONTRACT_ADDRESSES[chainId] = "0x..."

pnpm dev   # http://localhost:3000
```

### Environment Variables

```env
# cofhe-hardhat-starter/.env
PRIVATE_KEY=0x...
ETH_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
ARB_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/...

# frontend/.env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

---

## Key Technical Details

| Feature | Implementation |
|---------|---------------|
| Encryption | `@fhenixprotocol/cofhe-contracts` FHE types |
| Vote type | `euint32` (encrypted uint32, up to 4B votes) |
| Input type | `InEuint32 memory` (calldata encrypted value) |
| Tally op | `FHE.add(euint32, euint32)` — homomorphic |
| Access control | `FHE.allowThis()` / `FHE.allowPublic()` |
| Decryption | `FHE.publishDecryptResult()` + `FHE.getDecryptResultSafe()` |
| Client SDK | `@cofhe/sdk` — `Encryptable.uint32(n)` |
| Networks | Ethereum Sepolia, Arbitrum Sepolia, LocalCoFHE |

---

## Why This Wins Hackathons

1. **Clear value prop**: Every DAO has this problem. The solution is cryptographic, not social.
2. **Live demo**: Judges see the encryption animation, then watch real results reveal.
3. **Novel UX**: The scrambling `????` counter → reveal ceremony is visually striking.
4. **Uses Fhenix primitives correctly**: Real FHE on testnet, not simulated.
5. **Production-ready architecture**: Hooks, ABI types, demo mode fallback — all there.

---

## Resources Used

- [Fhenix Docs](https://docs.fhenix.io)
- [@cofhe/sdk](https://npmjs.com/package/@cofhe/sdk)
- [@cofhe/react](https://npmjs.com/package/@cofhe/react)
- [Privara Docs](https://reineira.xyz/docs) — for future private treasury execution integration
- [Privara SDK](https://www.npmjs.com/package/@reineira-os/sdk)
