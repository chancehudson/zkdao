import { createContext} from 'react'
import { makeAutoObservable } from 'mobx'
import { ZkIdentity, Strategy, hash1, stringifyBigInts } from '@unirep/utils'
import { UserState, schema } from '@unirep/core'
import { MemoryConnector } from 'anondb/web'
import { constructSchema } from 'anondb/types'
import { provider, UNIREP_ADDRESS, APP_ADDRESS, SERVER } from '../config'
import prover from './prover'
import poseidon from 'poseidon-lite'
import { ethers } from 'ethers'

export default class DAO {

  proposals = []
  proposalsByIndex = {}

  constructor(state) {
    makeAutoObservable(this)
    this.load()
    this.globalState = state
  }

  async load() {
    await this.loadProposals()
    setInterval(() => this.loadProposals(), 5000)
  }

  get activeProposals() {
    const currentEpoch = this.globalState.user.userState.calcCurrentEpoch()
    return this.proposals.filter(({ epoch }) => epoch === currentEpoch).map(p => ({
      active: true,
      ...p
    }))
  }

  get pastProposals() {
    const currentEpoch = this.globalState.user.userState.calcCurrentEpoch()
    return this.proposals.filter(({ epoch }) => epoch < currentEpoch)
  }

  async loadProposals() {
    const response = await fetch(`${SERVER}/api/proposals`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Request failed: ${data?.error}`)
    }
    const { proposals } = data
    this.proposals = proposals
    this.proposalsByIndex = proposals.reduce((acc, obj) => {
      return {
        [obj.index]: obj,
        ...acc,
      }
    }, {})
  }

  async vote(proposalIndex, voteFor) {
    const { userState } = this.globalState.user
    const { proof, publicSignals } = await userState.genEpochKeyProof({
      data: (BigInt(proposalIndex) << 1n) + (voteFor ? 1n : 0n),
      nonce: proposalIndex % this.globalState.user.userState.settings.numEpochKeyNoncePerEpoch,
      revealNonce: true,
    })
    const response = await fetch(`${SERVER}/api/vote`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        publicSignals,
        proof,
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Request failed: ${data?.error}`)
    }
    await provider.waitForTransaction(data.hash)
    await this.loadProposals()
  }

  async createSpendProposal(recipient, amount, description) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(recipient)) {
      throw new Error('Invalid recipient address')
    }
    if (!/^[0-9\.]+$/.test(amount)) {
      throw new Error('Invalid amount, must be a number')
    }
    if (typeof description !== 'string') {
      throw new Error('Invalid description, must be string')
    }
    const amountWei = ethers.utils.parseUnits(amount)
    const response = await fetch(`${SERVER}/api/proposal`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 1, // spend proposal type defined in contract
        description,
        recipient,
        amount: amountWei.toString(),
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Request failed: ${data?.error}`)
    }
    await provider.waitForTransaction(data.hash)
    await this.loadProposals()
  }

  async createSignUpProposal(semaphorePubkey, description) {
    if (typeof description !== 'string') {
      throw new Error('Invalid description, must be string')
    }
    const response = await fetch(`${SERVER}/api/proposal`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 0, // signup proposal type defined in contract
        description,
        semaphorePubkey,
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Request failed: ${data?.error}`)
    }
    await provider.waitForTransaction(data.hash)
    await this.loadProposals()
  }

  async execute(proposalIndex) {
    const response = await fetch(`${SERVER}/api/execute`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        proposalIndex,
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Request failed: ${data?.error}`)
    }
    await provider.waitForTransaction(data.hash)
    await this.loadProposals()
  }

}
