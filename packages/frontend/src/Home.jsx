import React from 'react'
import { observer } from 'mobx-react-lite'
import './home.css'
import Header from './components/Header'
import Button from './components/Button'
import Proposal from './components/Proposal'
import { useNavigate } from 'react-router'

import User from './contexts/User'
import DAO from './contexts/DAO'

export default observer(() => {
  const navigate = useNavigate()
  const userContext = React.useContext(User)
  const daoContext = React.useContext(DAO)
  const [remainingTime, setRemainingTime] = React.useState(0)
  const [reqRep, setReqRep] = React.useState({})
  const [repProofInputs, setRepProofInputs] = React.useState({})
  const [repProof, setRepProof] = React.useState(null)

  const updateTimer = () => {
    if (!userContext.userState) {
      setRemainingTime('Loading...')
      return
    }
    const time = userContext.userState.calcEpochRemainingTime()
    setRemainingTime(time)
  }

  React.useEffect(() => {
    setInterval(() => {
      updateTimer()
    }, 1000)
  }, [])

  React.useEffect(() => {
    if (!userContext.userState) {
      setTimeout(() => {
        userContext.epochKey(reqRep.nonce ?? 0).then((key) => setReqRep((v) => ({ ...v, epochKey: key })))
      }, 1000)
    } else {
        userContext.epochKey(reqRep.nonce ?? 0).then((key) => setReqRep((v) => ({ ...v, epochKey: key })))
    }
  }, [reqRep.nonce])

  if (!userContext.userState) {
    return (
      <div className="container">
        Loading...
      </div>
    )
  }

  return (
    <div className="container">
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
        <Button onClick={() => navigate('/propose/spend')}>Create Spend Proposal</Button>
        <Button onClick={() => navigate('/propose/user')}>Create New User Proposal</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <h4>Active Proposals</h4>
          {daoContext.proposals.map((p) => <Proposal proposal={p} />)}
        </div>
        <div>
          <h4>Past Proposals</h4>
          {daoContext.proposals.map((p) => <Proposal proposal={p} />)}
        </div>
      </div>
    </div>
  )
})
