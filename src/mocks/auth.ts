import { sign } from 'jsonwebtoken'

type SignInCredentials = {
  email: string
  password: string
}

const signInMock = async(credentials: SignInCredentials) => {
  const payload = sign({}, 'auth.secret',{
    expiresIn: '1d'
  })

  return {
    permissions: ['users.list', 'users.create', 'metrics.list'],
    refreshToken: '123456',
    roles: ['administrador'],
    token: payload
  }
}

export {
  signInMock
}
