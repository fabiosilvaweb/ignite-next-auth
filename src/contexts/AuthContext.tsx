import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children?: ReactNode
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated ] = useState(false)

  const signIn = async (credentials: SignInCredentials) => {
   try {
    const response = await api.post('/auth', credentials)
    console.log(response.data)
   } catch(error) {
    console.error('signIn', error)
   }
  }

  return (
  <AuthContext.Provider value={{ signIn, isAuthenticated }}>
    {children}
  </AuthContext.Provider>
  )
}

export {
  AuthProvider,
  AuthContext
}
