import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import Button from './Button'

import User from '../contexts/User'
import DAO from '../contexts/DAO'

export default observer(() => {
  const navigate = useNavigate()
  const userContext = React.useContext(User)
  const daoContext = React.useContext(DAO)
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div>DAO info</div>
          <div>Member count: </div>
          <div>Current epoch: </div>
        </div>
        {!userContext.hasSignedUp ? (
          <Button onClick={() => userContext.signup()}>Join</Button>
        ) : null}
        <h3 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          ZKDAO
        </h3>
      </div>
      <div style={{ height: '1px', background: 'black', width: '100%' }} />
    </>
  )
})
