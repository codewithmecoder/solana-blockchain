// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingappIDL from '../target/idl/votingapp.json'
import type { Votingapp } from '../target/types/votingapp'

// Re-export the generated IDL and type
export { Votingapp, VotingappIDL }

// The programId is imported from the program IDL.
export const VOTINGAPP_PROGRAM_ID = new PublicKey(VotingappIDL.address)

// This is a helper function to get the Votingapp Anchor program.
export function getVotingappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VotingappIDL, address: address ? address.toBase58() : VotingappIDL.address } as Votingapp, provider)
}

// This is a helper function to get the program ID for the Votingapp program depending on the cluster.
export function getVotingappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGAPP_PROGRAM_ID
  }
}
