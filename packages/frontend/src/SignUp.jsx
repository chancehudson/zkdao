import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import Header from './components/Header'
import Button from './components/Button'

import State from './contexts/state'

export default observer(() => {
  const navigate = useNavigate()
  const { dao, user } = React.useContext(State)
  const [description, setDescription] = React.useState('')
  return (
    <div className="container">
      <Header />
      <h3>Proposing new user</h3>
      <div style={{ display: 'flex' }}>
        <div>Semaphore Public Key:</div>
        <div style={{ width: '4px' }} />
        <div style={{ wordBreak: 'break-all'}}>{user.id.genIdentityCommitment().toString()}</div>
      </div>
      <textarea
        placeholder="Write a good proposal description here!"
        rows={12}
        onChange={(e) => setDescription(e.target.value)} value={description}
      />
      <Button onClick={async () => {
        await dao.createSignUpProposal(user.id.genIdentityCommitment().toString(), description)
        navigate('/')
      }}>Create Proposal</Button>
    </div>
  )
})
