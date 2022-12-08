import { ethers } from 'ethers'
import { EpochKeyProof } from '@unirep/circuits'
import { hash1 } from '@unirep/utils'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/ZKDAO.sol/ZKDAO.json")

export default ({ app, db, synchronizer }) => {
  app.get('/api/proposals', async (req, res) => {

    try {
      const {} = req.query
      const proposals = await db.findMany('Proposal', {
        where: {},
        include: {
          description: true,
        }
      })
      res.json({ proposals })
    } catch (error) {
      res.status(500).json({ error })
    }

  })
}
