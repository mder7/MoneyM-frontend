import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store'
import { api } from '../../../shared/api'
import { toProxyUrl } from '../../../shared/config/routes'
import { SHAREHOLDERS_MOCK } from './mock'
import type { Shareholder } from './types'
import type { LikeDto, PublishShareholderDto } from '../../../shared/api/Api'

export interface AddShareholderDraftBody {
  fullName: string
  image?: File
  video?: File
}

interface GetShareholderFeedByIdArgs {
  id: number
  next: boolean
}

interface PublishShareholderArgs {
  id: number
  body: PublishShareholderDto
}

const toShareholder = (shareholder: Shareholder): Shareholder => ({
  ...shareholder,
  imageUrl: toProxyUrl(shareholder.imageUrl),
  videoUrl: toProxyUrl(shareholder.videoUrl),
})

const isShareholder = (value: unknown): value is Shareholder => {
  if (typeof value !== 'object' || value === null) return false

  const shareholder = value as Record<string, unknown>
  return (
    typeof shareholder.id === 'number' &&
    typeof shareholder.fullName === 'string' &&
    (typeof shareholder.shortDescription === 'string' ||
      shareholder.shortDescription === null) &&
    (typeof shareholder.imageUrl === 'string' || shareholder.imageUrl === null) &&
    (typeof shareholder.videoUrl === 'string' || shareholder.videoUrl === null) &&
    typeof shareholder.ownershipShare === 'number' &&
    typeof shareholder.preferredShare === 'number' &&
    typeof shareholder.likesCount === 'number' &&
    typeof shareholder.isLiked === 'boolean' &&
    typeof shareholder.isMine === 'number'
  )
}

const parseShareholder = (value: unknown): Shareholder => {
  if (!isShareholder(value)) {
    throw new Error('Сервер вернул данные акционера в неожиданном формате')
  }
  return value
}

const parseShareholders = (value: unknown): Shareholder[] => {
  if (!Array.isArray(value)) {
    throw new Error('Сервер вернул список акционеров в неожиданном формате')
  }
  return value.map(parseShareholder)
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return 'Не удалось выполнить запрос'
}

const isBackendUnavailable = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  (!error.response ||
    error.response.status === 502 ||
    error.response.status === 503 ||
    error.response.status === 504)

const findMockFeedCard = (id?: number, next = false): Shareholder | null => {
  if (!SHAREHOLDERS_MOCK.length) return null
  if (id === undefined) return SHAREHOLDERS_MOCK[0]
  const index = SHAREHOLDERS_MOCK.findIndex((shareholder) => shareholder.id === id)
  if (index === -1) return SHAREHOLDERS_MOCK[0]
  if (!next) return SHAREHOLDERS_MOCK[index]
  return SHAREHOLDERS_MOCK[(index + 1) % SHAREHOLDERS_MOCK.length]
}

export const getShareholdersList = createAsyncThunk<
  Shareholder[],
  void,
  { state: RootState; rejectValue: string }
>('shareholders/getShareholdersList', async (_, { getState, rejectWithValue }) => {
  const { minShare } = getState().shareholders
  const { isAuthenticated } = getState().auth

  try {
    const response = await api.shareholders.getShareholdersList({ minShare })
    return parseShareholders(response.data).map(toShareholder)
  } catch (error) {
    if (isBackendUnavailable(error) && !isAuthenticated) {
      return SHAREHOLDERS_MOCK
        .filter((shareholder) => shareholder.ownershipShare >= minShare)
        .map(toShareholder)
    }
    return rejectWithValue(getErrorMessage(error))
  }
})

export const getShareholderFeed = createAsyncThunk<
  Shareholder,
  void,
  { state: RootState; rejectValue: string }
>('shareholders/getShareholderFeed', async (_, { getState, rejectWithValue }) => {
  try {
    const response = await api.shareholders.getShareholderFeed()
    return toShareholder(parseShareholder(response.data))
  } catch (error) {
    if (isBackendUnavailable(error) && !getState().auth.isAuthenticated) {
      const mockShareholder = findMockFeedCard()
      if (mockShareholder) return toShareholder(mockShareholder)
    }
    return rejectWithValue(getErrorMessage(error))
  }
})

export const getShareholderFeedById = createAsyncThunk<
  Shareholder,
  GetShareholderFeedByIdArgs,
  { state: RootState; rejectValue: string }
>(
  'shareholders/getShareholderFeedById',
  async ({ id, next }, { getState, rejectWithValue }) => {
    try {
      const response = await api.shareholders.getShareholderFeedById(id, {
        next: next ? 'true' : 'false',
      })
      return toShareholder(parseShareholder(response.data))
    } catch (error) {
      if (isBackendUnavailable(error) && !getState().auth.isAuthenticated) {
        const mockShareholder = findMockFeedCard(id, next)
        if (mockShareholder) return toShareholder(mockShareholder)
      }
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const getShareholderDraft = createAsyncThunk<
  Shareholder,
  void,
  { rejectValue: string }
>('shareholders/getShareholderDraft', async (_, { rejectWithValue }) => {
  try {
    const response = await api.shareholders.getShareholderDraft()
    return toShareholder(parseShareholder(response.data))
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const addShareholderDraft = createAsyncThunk<
  Shareholder,
  AddShareholderDraftBody,
  { rejectValue: string }
>('shareholders/addShareholderDraft', async (body, { rejectWithValue }) => {
  try {
    const response = await api.shareholders.addShareholderDraft(body)
    return toShareholder(parseShareholder(response.data))
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const publishShareholder = createAsyncThunk<
  Shareholder,
  PublishShareholderArgs,
  { rejectValue: string }
>('shareholders/publishShareholder', async ({ id, body }, { rejectWithValue }) => {
  try {
    const response = await api.shareholders.publishShareholder(id, body)
    return toShareholder(parseShareholder(response.data))
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deleteShareholder = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('shareholders/deleteShareholder', async (id, { rejectWithValue }) => {
  try {
    await api.shareholders.deleteShareholder(id)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const likeShareholder = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: string }
>(
  'shareholders/likeShareholder',
  async (id, { rejectWithValue }) => {
    try {
      const body: LikeDto = { value: 1 }
      await api.shareholders.likeShareholder(id, body)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    condition: (shareholderId, { getState }) => {
      const state = getState()
      if (!state.auth.isAuthenticated) return false

      const feedShareholder =
        state.shareholders.feedCard?.id === shareholderId
          ? state.shareholders.feedCard
          : null
      const listShareholder = state.shareholders.shareholders.find(
        (shareholder) => shareholder.id === shareholderId,
      )

      return !(feedShareholder?.isLiked || listShareholder?.isLiked)
    },
  },
)
