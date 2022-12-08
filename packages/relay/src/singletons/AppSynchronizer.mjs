import { Synchronizer } from '@unirep/core'
import { provider, UNIREP_ADDRESS, DB_PATH, APP_ADDRESS } from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import prover from './prover.mjs'
import schema from './schema.mjs'
import { ethers } from 'ethers'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/ZKDAO.sol/ZKDAO.json")

const daoContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi, provider)

class DAOSynchronizer extends Synchronizer {
  get contracts() {
    return {
      ...super.contracts,
      [daoContract.address]: {
        contract: daoContract,
        eventNames: [
        ]
      }
    }
  }

/**
 * event handlers
 **/

}

const db = await SQLiteConnector.create(schema, DB_PATH ?? ':memory:')
export default new DAOSynchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: APP_ADDRESS,
  prover,
})
