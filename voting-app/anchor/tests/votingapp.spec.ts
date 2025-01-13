import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { BN, Program } from "@coral-xyz/anchor";
import { Votingapp, VotingappIDL } from "../src";
import { PublicKey } from "@solana/web3.js";

const votingAddress = new PublicKey(
  "4VbXscpcBA5Kgv4NTnaEyvar5qdptkFFLAcWfCqWcQmS"
);

describe("votingapp", () => {
  let context;
  let provider;
  let votingProgram: Program<Votingapp>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [
        {
          name: "votingapp",
          programId: votingAddress,
        },
      ],
      []
    );
    provider = new BankrunProvider(context);
    votingProgram = new Program<Votingapp>(
      {
        ...VotingappIDL,
        address: votingAddress.toBase58(),
      } as Votingapp,
      provider
    );
  });

  it("initialize_poll", async () => {
    await votingProgram.methods
      .initializePoll(
        new BN(1),
        "What is your favorite type of peanut butter?",
        new BN(0),
        new BN(1756772268)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual(
      "What is your favorite type of peanut butter?"
    );
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("initialize_candidate", async () => {
    const pollId = new BN(1).toArrayLike(Buffer, "le", 8);

    await votingProgram.methods.initializeCandidate("Smooth", new BN(1)).rpc();
    await votingProgram.methods.initializeCandidate("Crunchy", new BN(1)).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("Crunchy"), pollId],
      votingAddress
    );

    const crunchyCandidate = await votingProgram.account.candidate.fetch(
      crunchyAddress
    );

    console.log(crunchyCandidate);

    expect(crunchyCandidate.candidateName).toEqual("Crunchy");
    expect(crunchyCandidate.candidateVote.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("Smooth"), pollId],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(
      smoothAddress
    );

    console.log(smoothCandidate);

    expect(smoothCandidate.candidateName).toEqual("Smooth");
    expect(smoothCandidate.candidateVote.toNumber()).toEqual(0);
  });
  it("vote", async () => {});
});
