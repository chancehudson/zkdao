import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import Button from './Button'

import State from '../contexts/state'

export default observer(() => {
  const navigate = useNavigate()
  const { user, dao } = React.useContext(State)
  const [remainingTime, setRemainingTime] = React.useState(0)
  const updateTimer = () => {
    if (!user.userState) {
      setRemainingTime('Loading...')
      return
    }
    const time = user.userState.calcEpochRemainingTime()
    setRemainingTime(time)
  }
  React.useEffect(() => {
    setInterval(() => {
      updateTimer()
    }, 1000)
  }, [])
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div>DAO info</div>
          <div>Member count: </div>
          <div>Current epoch: {user.currentEpoch}</div>
          <div>Remaining Time: {remainingTime}</div>
        </div>
        {!user.hasSignedUp ? (
          <Button onClick={() => user.signup()}>Join</Button>
        ) : null}
        <h3 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          ZKDAO
        </h3>
      </div>
      <div style={{ height: '1px', background: 'black', width: '100%' }} />
    </>
  )
})
