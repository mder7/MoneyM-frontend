import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import {
  finishAuthRequest,
  setAuthenticated,
  startAuthRequest,
} from '../../entities/auth/model/authSlice'
import { ROUTES } from '../../shared/config/routes'
import { authAxios } from '../../shared/api/authAxios'
import './LoginPage.css'

interface UserCredentials {
  login: string
  password: string
}

interface LoginResponse {
  login: string
}

const getRequestError = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
    if (error.response?.status === 401) return 'Неверный логин или пароль'
  }
  if (error instanceof Error) return error.message
  return fallback
}

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<UserCredentials>({
    login: '',
    password: '',
  })
  const [pendingRequest, setPendingRequest] = useState<'login' | 'register' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setPendingRequest('login')
    dispatch(startAuthRequest())

    try {
      const response = await authAxios.post<LoginResponse>(
        '/users/login',
        credentials,
      )
      dispatch(setAuthenticated(response.data.login))
      navigate(ROUTES.TILES)
    } catch (error) {
      setErrorMessage(getRequestError(error, 'Не удалось войти'))
    } finally {
      dispatch(finishAuthRequest())
      setPendingRequest(null)
    }
  }

  const handleRegister = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    if (!credentials.login.trim()) {
      setErrorMessage('Введите логин')
      return
    }
    if (credentials.password.length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов')
      return
    }

    setPendingRequest('register')
    dispatch(startAuthRequest())
    try {
      await authAxios.post<void>('/users/register', credentials)
      setSuccessMessage('Регистрация прошла успешно. Теперь войдите.')
    } catch (error) {
      setErrorMessage(getRequestError(error, 'Не удалось зарегистрироваться'))
    } finally {
      dispatch(finishAuthRequest())
      setPendingRequest(null)
    }
  }

  const isPending = pendingRequest !== null

  return (
    <div className="authPage">
      <h1 className="pageTitle">Вход / регистрация</h1>
      <div className="authCard">
        {errorMessage && <Alert className="authAlert" variant="danger" role="alert">{errorMessage}</Alert>}
        {successMessage && <Alert className="authAlert" variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="userLogin">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              className="authControl"
              type="text"
              autoComplete="username"
              required
              value={credentials.login}
              disabled={isPending}
              onChange={(event) =>
                setCredentials({ ...credentials, login: event.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="userPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              className="authControl"
              type="password"
              autoComplete={pendingRequest === 'register' ? 'new-password' : 'current-password'}
              minLength={6}
              required
              value={credentials.password}
              disabled={isPending}
              onChange={(event) =>
                setCredentials({ ...credentials, password: event.target.value })
              }
            />
          </Form.Group>

          <div className="authActions">
            <Button className="authButton authButtonPrimary" type="submit" disabled={isPending}>
              {pendingRequest === 'login' ? 'Входим…' : 'Войти'}
            </Button>
            <Button
              className="authButton authButtonSecondary"
              type="button"
              disabled={isPending}
              onClick={handleRegister}
            >
              {pendingRequest === 'register' ? 'Регистрируем…' : 'Зарегистрироваться'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
