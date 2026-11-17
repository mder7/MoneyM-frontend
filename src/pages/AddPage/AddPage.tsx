import type { ChangeEvent, FC, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { Shareholder } from '../../entities/shareholder/model/types'
import {
  addShareholderDraft,
  getShareholderDraft,
  publishShareholder,
} from '../../entities/shareholder/model/shareholdersThunks'
import { DEFAULT_IMAGE, ROUTES } from '../../shared/config/routes'
import { selectRequestsLoading } from '../../entities/shareholder/model/selectors'
import './AddPage.css'

interface ShareholderDraftForm {
  fullName: string
  shortDescription: string
  ownershipShare: string
  preferredShare: string
}

const initialForm: ShareholderDraftForm = {
  fullName: '',
  shortDescription: '',
  ownershipShare: '',
  preferredShare: '',
}

const getAddPageError = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return 'Не удалось сохранить акционера'
}

const getOwnershipShareValue = (shareholder: Shareholder): string =>
  shareholder.ownershipShare ? String(shareholder.ownershipShare) : ''

const getPreferredShareValue = (shareholder: Shareholder): string =>
  shareholder.preferredShare ? String(shareholder.preferredShare) : ''

export const AddPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const shareholderDraft = useAppSelector(
    (state) => state.shareholders.shareholderDraft,
  )
  const isLoading = useAppSelector(selectRequestsLoading)
  const [shareholderDraftForm, setShareholderDraftForm] =
    useState<ShareholderDraftForm>(initialForm)
  const [shareholderImageFile, setShareholderImageFile] = useState<File | null>(null)
  const [shareholderVideoFile, setShareholderVideoFile] = useState<File | null>(null)
  const [shareholderImagePreview, setShareholderImagePreview] = useState<string | null>(null)
  const [shareholderVideoPreview, setShareholderVideoPreview] = useState<string | null>(null)
  const shareholderImagePreviewRef = useRef<string | null>(null)
  const shareholderVideoPreviewRef = useRef<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  useEffect(() => {
    void dispatch(getShareholderDraft()).then((result) => {
      if (getShareholderDraft.fulfilled.match(result)) {
        setShareholderDraftForm({
          fullName: result.payload.fullName,
          shortDescription: result.payload.shortDescription ?? '',
          ownershipShare: getOwnershipShareValue(result.payload),
          preferredShare: getPreferredShareValue(result.payload),
        })
      }
    })
  }, [dispatch])

  useEffect(
    () => () => {
      if (shareholderImagePreviewRef.current) {
        URL.revokeObjectURL(shareholderImagePreviewRef.current)
      }
      if (shareholderVideoPreviewRef.current) {
        URL.revokeObjectURL(shareholderVideoPreviewRef.current)
      }
    },
    [],
  )

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedShareholderImage = event.target.files?.[0] ?? null
    if (shareholderImagePreviewRef.current) {
      URL.revokeObjectURL(shareholderImagePreviewRef.current)
    }
    const shareholderImageObjectUrl = selectedShareholderImage
      ? URL.createObjectURL(selectedShareholderImage)
      : null
    shareholderImagePreviewRef.current = shareholderImageObjectUrl
    setShareholderImageFile(selectedShareholderImage)
    setShareholderImagePreview(shareholderImageObjectUrl)
  }

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedShareholderVideo = event.target.files?.[0] ?? null
    if (shareholderVideoPreviewRef.current) {
      URL.revokeObjectURL(shareholderVideoPreviewRef.current)
    }
    const shareholderVideoObjectUrl = selectedShareholderVideo
      ? URL.createObjectURL(selectedShareholderVideo)
      : null
    shareholderVideoPreviewRef.current = shareholderVideoObjectUrl
    setShareholderVideoFile(selectedShareholderVideo)
    setShareholderVideoPreview(shareholderVideoObjectUrl)
  }

  const handlePublishShareholder = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setPageError(null)

    try {
      const shareholderDraftResult = await dispatch(
        addShareholderDraft({
          fullName: shareholderDraftForm.fullName.trim(),
          ...(shareholderImageFile ? { image: shareholderImageFile } : {}),
          ...(shareholderVideoFile ? { video: shareholderVideoFile } : {}),
        }),
      )
      if (!addShareholderDraft.fulfilled.match(shareholderDraftResult)) {
        setPageError(
          shareholderDraftResult.payload ??
            shareholderDraftResult.error.message ??
            'Не удалось сохранить черновик',
        )
        return
      }

      const shareholderPublishResult = await dispatch(
        publishShareholder({
          id: shareholderDraftResult.payload.id,
          body: {
            shortDescription: shareholderDraftForm.shortDescription.trim(),
            ownershipShare: Number(shareholderDraftForm.ownershipShare),
            preferredShare: Number(shareholderDraftForm.preferredShare),
          },
        }),
      )
      if (!publishShareholder.fulfilled.match(shareholderPublishResult)) {
        setPageError(
          shareholderPublishResult.payload ??
            shareholderPublishResult.error.message ??
            'Не удалось опубликовать акционера',
        )
        return
      }

      navigate(ROUTES.TILES)
    } catch (error) {
      setPageError(getAddPageError(error))
    }
  }

  const shareholderImageUrl =
    shareholderImagePreview || shareholderDraft?.imageUrl || DEFAULT_IMAGE
  const shareholderVideoUrl = shareholderVideoPreview || shareholderDraft?.videoUrl

  return (
    <div className="addPage">
      <h1 className="pageTitle">Добавить акционера</h1>
      <div className="addCard">
        {pageError && <Alert variant="danger" role="alert">{pageError}</Alert>}

        <Form onSubmit={handlePublishShareholder}>
          <Form.Group className="mb-3" controlId="shareholderFullName">
            <Form.Label>Название / ФИО</Form.Label>
            <Form.Control
              required
              value={shareholderDraftForm.fullName}
              disabled={isLoading}
              onChange={(event) =>
                setShareholderDraftForm({
                  ...shareholderDraftForm,
                  fullName: event.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="shareholderDescription">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={shareholderDraftForm.shortDescription}
              disabled={isLoading}
              onChange={(event) =>
                setShareholderDraftForm({
                  ...shareholderDraftForm,
                  shortDescription: event.target.value,
                })
              }
            />
          </Form.Group>

          <div className="addShareInputs">
            <Form.Group className="mb-3" controlId="shareholderOwnershipShare">
              <Form.Label>Доля владения, %</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                required
                value={shareholderDraftForm.ownershipShare}
                disabled={isLoading}
                onChange={(event) =>
                  setShareholderDraftForm({
                    ...shareholderDraftForm,
                    ownershipShare: event.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="shareholderPreferredShare">
              <Form.Label>Привилегированные акции, %</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                required
                value={shareholderDraftForm.preferredShare}
                disabled={isLoading}
                onChange={(event) =>
                  setShareholderDraftForm({
                    ...shareholderDraftForm,
                    preferredShare: event.target.value,
                  })
                }
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="shareholderImage">
            <Form.Label>Фото</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={handleImageChange}
            />
          </Form.Group>
          <img
            className="addImagePreview"
            src={shareholderImageUrl}
            alt="Предпросмотр фото акционера"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_IMAGE
            }}
          />

          <Form.Group className="my-3" controlId="shareholderVideo">
            <Form.Label>Видео</Form.Label>
            <Form.Control
              type="file"
              accept="video/*"
              disabled={isLoading}
              onChange={handleVideoChange}
            />
          </Form.Group>
          {shareholderVideoUrl && (
            <video
              className="addVideoPreview"
              src={shareholderVideoUrl}
              controls
              playsInline
            />
          )}

          <Button className="addPublishButton" type="submit" disabled={isLoading}>
            Опубликовать
          </Button>
        </Form>
      </div>
    </div>
  )
}
