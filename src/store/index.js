import { configureStore } from '@reduxjs/toolkit'
import tradesReducer from './tradesSlice'

export const store = configureStore({
  reducer: {
    trades: tradesReducer,
  },
})

export default store
