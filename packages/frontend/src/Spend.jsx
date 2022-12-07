import React from 'react'
import Header from './components/Header'
import Button from './components/Button'

import DAO from './contexts/DAO'

export default () => {
  const daoContext = React.useContext(DAO)
  const [to, setTo] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [description, setDescription] = React.useState('')
  return (
    <div className="container">
      <Header />
      <h3>Proposing new spend</h3>
      <div style={{ display: 'flex' }}>
        <div>To:</div>
        <div style={{ width: '4px' }} />
        <input type="text" onChange={(e) => setTo(e.target.value)} value={to} />
      </div>
      <div style={{ display: 'flex' }}>
        <div>Amount (Ether):</div>
        <div style={{ width: '4px' }} />
        <input type="text" onChange={(e) => setAmount(e.target.value)} value={amount} />
      </div>
      <textarea
        placeholder="Write a good proposal description here!"
        rows={12}
        onChange={(e) => setDescription(e.target.value)} value={description}
      />
      <Button onClick={() => daoContext.createSpendProposal(to, amount, description)}>Create Proposal</Button>
    </div>
  )
}
