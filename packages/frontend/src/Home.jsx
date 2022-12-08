import React from 'react'
import { observer } from 'mobx-react-lite'
import './home.css'
import Header from './components/Header'
import Button from './components/Button'
import Proposal from './components/Proposal'
import { useNavigate } from 'react-router'

import State from './contexts/state'

export default observer(() => {
  const navigate = useNavigate()
  const { user, dao } = React.useContext(State)

  if (!user.userState) {
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
          {dao.activeProposals.map((p) => <Proposal key={p.index} proposal={p} />)}
        </div>
        <div>
          <h4>Past Proposals</h4>
          {dao.pastProposals.map((p) => <Proposal key={p.index} proposal={p} />)}
        </div>
      </div>
    </div>
  )
})
