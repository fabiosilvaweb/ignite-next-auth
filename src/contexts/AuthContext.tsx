import Router from "next/router";
import { createContext, ReactNode, useState } from "react";
import { signInMock } from "../mocks/auth";
import { setCookie } from 'nookies';

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
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children?: ReactNode
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  const signIn = async (credentials: SignInCredentials) => {
    const response = await signInMock(credentials)

    const nookieConfig = {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    }

    setCookie(undefined, 'ignite-auth.token', response.token, nookieConfig)
    setCookie(undefined, 'ignite-auth.refreshToken', response.refreshToken, nookieConfig)

    setUser({
      email: credentials.email,
      permissions: response.permissions,
      roles: response.roles
    })

    Router.push('/dashboard')
  }

  return (
  <AuthContext.Provider value={{ user, signIn, isAuthenticated }}>
    {children}
  </AuthContext.Provider>
  )
}

export {
  AuthProvider,
  AuthContext
}
