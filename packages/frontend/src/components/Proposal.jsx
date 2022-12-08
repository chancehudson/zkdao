import React from 'react'
import { observer } from 'mobx-react-lite'
import { ethers } from 'ethers'
import './proposal.css'
import Button from './Button'
import State from '../contexts/state'

export default observer(({ proposal }) => {
  const { dao } = React.useContext(State)
  return (
    <div className="proposal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '4px', fontWeight: "600" }}>Proposal {proposal.index}</div>
          {
            proposal.type === 0 ?
            (
              <div>A new member would like to join</div>
            ):(
              <>
                <div>Spend {ethers.utils.formatUnits(proposal.amount).toString()} Ether</div>
                <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>to <a target="_blank" href={`https://etherscan.io/address/${proposal.recipient}`}>{proposal.recipient}</a></div>
              </>
            )
          }
        </div>
        <div>
          <div><span style={{ color: 'green'}}>For</span>: {proposal.votesFor}</div>
          <div><span style={{ color: 'darkred'}}>Against</span>: {proposal.votesAgainst}</div>
          <div>Quorum: {proposal.votesFor + proposal.votesAgainst >= proposal.quorum ? '✅' : proposal.quorum}</div>
        </div>
      </div>
      <div style={{ height: '4px', borderBottom: '1px solid black', marginBottom: '8px' }} />
      <div>{proposal.description?.text}</div>
      {
        proposal.active ? (
          <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-around' }}>
            <Button onClick={() => dao.vote(proposal.index, true)}>Vote For</Button>
            <Button onClick={() => dao.vote(proposal.index, false)}>Vote Against</Button>
          </div>
        ) : null
      }
    </div>
  )
})
