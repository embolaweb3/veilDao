"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { Encryptable } from "@cofhe/sdk";
import { VEILDAO_ABI, getVeilDAOAddress, type VoteChoice } from "@/lib/contracts";

type VoteStage =
  | "idle"
  | "encrypting"
  | "sending"
  | "confirming"
  | "success"
  | "error";

export function useFHEVote(proposalId: bigint) {
  const chainId  = useChainId();
  const address  = getVeilDAOAddress(chainId ?? 0);
  const [stage,  setStage]  = useState<VoteStage>("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  const { writeContractAsync, data: hash } = useWriteContract();
  const { isPending: waitPending, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });
  const isConfirming = !!hash && waitPending;

  const castVote = useCallback(
    async (choice: VoteChoice, cofheClient: any) => {
      if (!address || !cofheClient) {
        setErrMsg("Wallet not connected or wrong network");
        setStage("error");
        return;
      }

      try {
        setStage("encrypting");

        // Each vote is a triple: exactly one field is 1, the rest are 0.
        // The FHE ciphertexts are randomised — an observer can NOT determine
        // which was 1, making coercion cryptographically impossible.
        const forVal     = choice === "for"     ? 1n : 0n;
        const againstVal = choice === "against" ? 1n : 0n;
        const abstainVal = choice === "abstain" ? 1n : 0n;

        const encrypted = await cofheClient
          .encryptInputs([
            Encryptable.uint32(forVal),
            Encryptable.uint32(againstVal),
            Encryptable.uint32(abstainVal),
          ])
          .execute();

        setStage("sending");

        await writeContractAsync({
          address,
          abi:          VEILDAO_ABI,
          functionName: "castVote",
          args:         [proposalId, encrypted[0], encrypted[1], encrypted[2]],
        });

        setStage("confirming");
      } catch (err: any) {
        setErrMsg(err?.message ?? "Transaction failed");
        setStage("error");
      }
    },
    [address, proposalId, writeContractAsync]
  );

  // Update stage when tx confirms
  if (isSuccess && stage === "confirming") setStage("success");

  return {
    castVote,
    stage,
    errMsg,
    isEncrypting:  stage === "encrypting",
    isSending:     stage === "sending",
    isConfirming:  stage === "confirming" || isConfirming,
    isSuccess:     stage === "success",
    isError:       stage === "error",
    reset:         () => { setStage("idle"); setErrMsg(""); },
  };
}
