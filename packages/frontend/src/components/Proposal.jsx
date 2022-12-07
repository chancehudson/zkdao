import React from 'react'
import './proposal.css'

export default ({ proposal }) => {
  return (
    <div className="proposal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>{proposal.type === 'new-member' ? 'New Member' : 'Spend'}</div>
        <div>
          <div><span style={{ color: 'green'}}>For</span>: {proposal.forVotes}</div>
          <div><span style={{ color: 'darkred'}}>Against</span>: {proposal.againstVotes}</div>
          <div>Quorum: {proposal.forVotes + proposal.againstVotes >= proposal.quorum ? '✅' : proposal.quorum}</div>
        </div>
      </div>
      <div style={{ height: '4px' }} />
      <div>{proposal.text}</div>
    </div>
  )
}
