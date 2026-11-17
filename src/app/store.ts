import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../entities/auth/model/authSlice'
import shareholdersReducer from '../entities/shareholder/model/shareholdersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shareholders: shareholdersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
