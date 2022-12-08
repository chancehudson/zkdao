import { ethers } from 'ethers'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/ZKDAO.sol/ZKDAO.json")

export default ({ app, db, synchronizer }) => {
  app.post('/api/execute', async (req, res) => {

    try {
      const { proposalIndex } = req.body
      const appContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi)
      // const contract =
      const calldata = appContract.interface.encodeFunctionData(
        'executeProposal',
        [proposalIndex]
      )
      const hash = await TransactionManager.queueTransaction(
        APP_ADDRESS,
        calldata,
      )
      res.json({ hash })

    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }

  })
}
