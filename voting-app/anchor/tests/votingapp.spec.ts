import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { BN, Program } from "@coral-xyz/anchor";
import { Votingapp, VotingappIDL } from "../src";
import { PublicKey } from "@solana/web3.js";

const votingAddress = new PublicKey(
  "4VbXscpcBA5Kgv4NTnaEyvar5qdptkFFLAcWfCqWcQmS"
);

describe("votingapp", () => {
  it("initialize_poll", async () => {
    const context = await startAnchor(
      "",
      [
        {
          name: "votingapp",
          programId: votingAddress,
        },
      ],
      []
    );
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingapp>(
      {
        ...VotingappIDL,
        address: votingAddress.toBase58(),
      } as Votingapp,
      provider
    );

    await votingProgram.methods
      .initializePoll(
        new BN(1),
        "What is your favorite type of peanut butter?",
        new BN(0),
        new BN(1756772268)
      )
      .rpc();
  });
});
