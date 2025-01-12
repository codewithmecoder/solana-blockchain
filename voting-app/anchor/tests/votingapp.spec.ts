import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingapp} from '../target/types/votingapp'

describe('votingapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingapp as Program<Votingapp>

  const votingappKeypair = Keypair.generate()

  it('Initialize Votingapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingapp: votingappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingappKeypair])
      .rpc()

    const currentCount = await program.account.votingapp.fetch(votingappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingapp', async () => {
    await program.methods.increment().accounts({ votingapp: votingappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingapp.fetch(votingappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingapp Again', async () => {
    await program.methods.increment().accounts({ votingapp: votingappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingapp.fetch(votingappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingapp', async () => {
    await program.methods.decrement().accounts({ votingapp: votingappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingapp.fetch(votingappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingapp value', async () => {
    await program.methods.set(42).accounts({ votingapp: votingappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingapp.fetch(votingappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingapp: votingappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingapp.fetchNullable(votingappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
