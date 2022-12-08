import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'
import DAO from './DAO'
import User from './User'

const state = {}

const user = new User(state)
const dao = new DAO(state)

Object.assign(state, {
  user,
  dao
})

makeAutoObservable(state)

export default createContext(state)
