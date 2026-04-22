"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { VEILDAO_ABI, getVeilDAOAddress, type Proposal, DEMO_PROPOSALS } from "@/lib/contracts";
import { useState, useEffect } from "react";

function useContractAddress() {
  const chainId = useChainId();
  return getVeilDAOAddress(chainId ?? 0);
}

export function useProposals() {
  const address = useContractAddress();
  const [useDemoData, setUseDemoData] = useState(false);

  const { data: count } = useReadContract({
    address,
    abi:          VEILDAO_ABI,
    functionName: "proposalCount",
    query:        { enabled: !!address },
  });

  const { data: proposals, isLoading } = useReadContract({
    address,
    abi:          VEILDAO_ABI,
    functionName: "getProposals",
    args:         [0n, 20n],
    query:        { enabled: !!address && count !== undefined },
  });

  useEffect(() => {
    // Fall back to demo data if no contract is deployed on this chain
    if (!address) setUseDemoData(true);
  }, [address]);

  return {
    proposals:   useDemoData ? DEMO_PROPOSALS : ((proposals as Proposal[]) ?? []),
    isLoading:   !useDemoData && isLoading,
    isDemoMode:  useDemoData,
    totalCount:  useDemoData ? BigInt(DEMO_PROPOSALS.length) : (count ?? 0n),
  };
}

export function useProposal(id: bigint) {
  const address = useContractAddress();

  const { data, isLoading, refetch } = useReadContract({
    address,
    abi:          VEILDAO_ABI,
    functionName: "getProposal",
    args:         [id],
    query:        { enabled: !!address, refetchInterval: 5_000 },
  });

  const isDemoMode = !address;
  const demoProposal = DEMO_PROPOSALS.find(p => p.id === id);

  return {
    proposal:   isDemoMode ? demoProposal : (data as Proposal | undefined),
    isLoading:  !isDemoMode && isLoading,
    isDemoMode,
    refetch,
  };
}

export function useHasVoted(proposalId: bigint) {
  const { address: voter } = useAccount();
  const contractAddress    = useContractAddress();

  const { data } = useReadContract({
    address:      contractAddress,
    abi:          VEILDAO_ABI,
    functionName: "hasVoted",
    args:         [proposalId, voter!],
    query:        { enabled: !!contractAddress && !!voter },
  });

  return !!data;
}

export function useCreateProposal() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isPending: waitPending, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });
  const isConfirming = !!hash && waitPending;

  const createProposal = (
    title:           string,
    description:     string,
    category:        string,
    durationSeconds: number
  ) => {
    if (!address) return;
    writeContract({
      address,
      abi:          VEILDAO_ABI,
      functionName: "createProposal",
      args:         [title, description, category, BigInt(durationSeconds)],
    });
  };

  return { createProposal, isPending, isConfirming, isSuccess, hash, error };
}

export function useResolveProposal(proposalId: bigint) {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isPending: waitPending, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });
  const isConfirming = !!hash && waitPending;

  const resolve = () => {
    if (!address) return;
    writeContract({
      address,
      abi:          VEILDAO_ABI,
      functionName: "resolveProposal",
      args:         [proposalId],
    });
  };

  return { resolve, isPending, isConfirming, isSuccess };
}
