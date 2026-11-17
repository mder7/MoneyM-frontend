import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  username: string | null
  pendingRequestCount: number
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  pendingRequestCount: 0,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true
      state.username = action.payload
    },
    clearAuth: () => initialState,
    startAuthRequest: (state) => {
      state.pendingRequestCount += 1
    },
    finishAuthRequest: (state) => {
      state.pendingRequestCount = Math.max(0, state.pendingRequestCount - 1)
    },
  },
})

export const {
  setAuthenticated,
  clearAuth,
  startAuthRequest,
  finishAuthRequest,
} = authSlice.actions
export default authSlice.reducer
