import type { RootState } from '../../../app/store'

export const selectShareholders = (state: RootState) => state.shareholders.shareholders
export const selectFeedCard = (state: RootState) => state.shareholders.feedCard
export const selectShareholderDraft = (state: RootState) =>
  state.shareholders.shareholderDraft
export const selectMinShare = (state: RootState) => state.shareholders.minShare
export const selectShareholdersLoading = (state: RootState) =>
  state.shareholders.loadingCount > 0
export const selectRequestsLoading = (state: RootState) =>
  state.shareholders.loadingCount > 0 || state.auth.pendingRequestCount > 0
export const selectShareholdersError = (state: RootState) => state.shareholders.error
