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

class DAO {

  proposals = [
    {
      epoch: 1,
      type: 'new-member',
      text: 'Hi, my name is Joe, I\'d like to join the DAO.',
      forVotes: 4,
      againstVotes: 5,
      quorum: 4,
    },
    {
      epoch: 2,
      type: 'spend',
      text: 'I\'d like to pay 0x00 to do some stuff',
      forVotes: 2,
      againstVotes: 1,
      quorum: 4,
    }
  ]

  constructor() {
    makeAutoObservable(this)
    this.load()
  }

  async load() {
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
    // TODO: load proposals
  }

}

export default createContext(new DAO())
