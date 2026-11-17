import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { clearAuth } from '../../auth/model/authSlice'
import type { Shareholder } from './types'
import {
  addShareholderDraft,
  deleteShareholder,
  getShareholderDraft,
  getShareholderFeed,
  getShareholderFeedById,
  getShareholdersList,
  likeShareholder,
  publishShareholder,
} from './shareholdersThunks'

interface ShareholdersState {
  shareholders: Shareholder[]
  feedCard: Shareholder | null
  shareholderDraft: Shareholder | null
  minShare: number
  loadingCount: number
  error: string | null
}

const initialState: ShareholdersState = {
  shareholders: [],
  feedCard: null,
  shareholderDraft: null,
  minShare: 0,
  loadingCount: 0,
  error: null,
}

const shareholdersSlice = createSlice({
  name: 'shareholders',
  initialState,
  reducers: {
    setMinShare: (state, action: PayloadAction<number>) => {
      state.minShare = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearAuth, (state) => {
        state.minShare = 0
      })
      .addCase(getShareholdersList.fulfilled, (state, action) => {
        state.shareholders = action.payload
      })
      .addCase(getShareholderFeed.fulfilled, (state, action) => {
        state.feedCard = action.payload
      })
      .addCase(getShareholderFeedById.fulfilled, (state, action) => {
        state.feedCard = action.payload
      })
      .addCase(getShareholderDraft.fulfilled, (state, action) => {
        state.shareholderDraft = action.payload
      })
      .addCase(addShareholderDraft.fulfilled, (state, action) => {
        state.shareholderDraft = action.payload
      })
      .addCase(publishShareholder.fulfilled, (state, action) => {
        state.shareholderDraft = null
        const shareholderIndex = state.shareholders.findIndex(
          (shareholder) => shareholder.id === action.payload.id,
        )
        if (shareholderIndex !== -1) {
          state.shareholders[shareholderIndex] = action.payload
        } else {
          state.shareholders.push(action.payload)
        }
      })
      .addCase(deleteShareholder.fulfilled, (state, action) => {
        state.shareholders = state.shareholders.filter(
          (shareholder) => shareholder.id !== action.payload,
        )
        if (state.shareholderDraft?.id === action.payload) {
          state.shareholderDraft = null
        }
        if (state.feedCard?.id === action.payload) {
          state.feedCard = null
        }
      })
      .addCase(likeShareholder.fulfilled, (state, action) => {
        state.shareholders = state.shareholders.map((shareholder) =>
          shareholder.id === action.payload
            ? {
                ...shareholder,
                likesCount: shareholder.likesCount + (shareholder.isLiked ? 0 : 1),
                isLiked: true,
              }
            : shareholder,
        )
        if (state.feedCard?.id === action.payload) {
          if (!state.feedCard.isLiked) state.feedCard.likesCount += 1
          state.feedCard.isLiked = true
        }
      })
      .addMatcher(
        isAnyOf(
          getShareholdersList.pending,
          getShareholderFeed.pending,
          getShareholderFeedById.pending,
          getShareholderDraft.pending,
          addShareholderDraft.pending,
          publishShareholder.pending,
          deleteShareholder.pending,
          likeShareholder.pending,
        ),
        (state) => {
          state.loadingCount += 1
          state.error = null
        },
      )
      .addMatcher(
        isAnyOf(
          getShareholdersList.fulfilled,
          getShareholderFeed.fulfilled,
          getShareholderFeedById.fulfilled,
          getShareholderDraft.fulfilled,
          addShareholderDraft.fulfilled,
          publishShareholder.fulfilled,
          deleteShareholder.fulfilled,
          likeShareholder.fulfilled,
        ),
        (state) => {
          state.loadingCount = Math.max(0, state.loadingCount - 1)
        },
      )
      .addMatcher(
        isAnyOf(
          getShareholdersList.rejected,
          getShareholderFeed.rejected,
          getShareholderFeedById.rejected,
          getShareholderDraft.rejected,
          addShareholderDraft.rejected,
          publishShareholder.rejected,
          deleteShareholder.rejected,
          likeShareholder.rejected,
        ),
        (state, action) => {
          state.loadingCount = Math.max(0, state.loadingCount - 1)
          state.error =
            action.payload ?? action.error.message ?? 'Не удалось выполнить запрос'
        },
      )
  },
})

export const { setMinShare } = shareholdersSlice.actions
export default shareholdersSlice.reducer
