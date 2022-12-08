import { ethers } from 'ethers'
import { EpochKeyProof } from '@unirep/circuits'
import { hash1 } from '@unirep/utils'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/ZKDAO.sol/ZKDAO.json")

export default ({ app, db, synchronizer }) => {
  app.post('/api/proposal', async (req, res) => {

    try {
      const {
        type,
        recipient,
        amount,
        semaphorePubkey,
        description
      } = req.body
      if (typeof type !== 'number') {
        return res.status(400).json({ error: `Invalid "type", must be number: ${typeof type}` })
      }
      if (type !== 0 && type !== 1) {
        return res.status(400).json({ error: `Invalid "type" value, must be 1 or 0: ${type}` })
      }

      const descriptionHash = hash1([`0x${Buffer.from(description).toString('hex')}`])

      await db.upsert('ProposalDescription', {
        where: {
          hash: descriptionHash.toString(),
        },
        update: {},
        create: {
          hash: descriptionHash.toString(),
          text: description,
        }
      })

      const appContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi)

      if (type === 0) {
        // we're doing a signup proposal
        const calldata = appContract.interface.encodeFunctionData(
          'proposeSignUp',
          [semaphorePubkey, descriptionHash]
        )
        const hash = await TransactionManager.queueTransaction(
          APP_ADDRESS,
          calldata,
        )
        res.json({ hash })
      } else {
        const calldata = appContract.interface.encodeFunctionData(
          'proposeSpend',
          [recipient, amount, descriptionHash]
        )
        const hash = await TransactionManager.queueTransaction(
          APP_ADDRESS,
          calldata,
        )
        res.json({ hash })
      }
    } catch (error) {
      res.status(500).json({ error })
    }

  })
}
