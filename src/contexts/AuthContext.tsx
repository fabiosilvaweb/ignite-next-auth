import Router from "next/router";
import { createContext, ReactNode, useState, useEffect } from "react";
import { getUserDataMockApi, signInMockApi } from "../mocks/auth";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from '../services/apiClient'
import { nookieConfig } from "../config/nookie";

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  user?: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut: () => void
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children?: ReactNode
}

const AuthContext = createContext({} as AuthContextData);

export const signOut = () => {
  destroyCookie(undefined, 'ignite-auth.token')
  destroyCookie(undefined, 'ignite-auth.refreshToken')
  Router.push('/')
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user


  useEffect(() => {
    const { 'ignite-auth.token': token } = parseCookies()

    if (token) {
      const response = getUserDataMockApi()

      setUser({
        email: response.email,
        permissions: response.permissions,
        roles: response.roles
      })
    }
  }, [])

  const signIn = async (credentials: SignInCredentials) => {
    const response = await signInMockApi(credentials)

    setCookie(undefined, 'ignite-auth.token', response.token, nookieConfig)
    setCookie(undefined, 'ignite-auth.refreshToken', response.refreshToken, nookieConfig)

    setUser({
      email: credentials.email,
      permissions: response.permissions,
      roles: response.roles
    })

    api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

    Router.push('/dashboard')
  }

  return (
  <AuthContext.Provider value={{ user, signIn, isAuthenticated, signOut }}>
    {children}
  </AuthContext.Provider>
  )
}

export {
  AuthProvider,
  AuthContext
}
