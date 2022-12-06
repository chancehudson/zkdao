const fs = require('fs')
const path = require('path')

const { abi } = require('../artifacts/contracts/ZKDAO.sol/ZKDAO.json')

fs.writeFileSync(
  path.join(__dirname, '../abi/ZKDAO.json'),
  JSON.stringify(abi)
)
