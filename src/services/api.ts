import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies()

const nookieConfig = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/'
}

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: `Bearer ${cookies['ignite-auth.token']}`
  }
});

interface ApiResponseError {
  code: string
}

api.interceptors.response.use(response => response, (error: AxiosError<ApiResponseError>) => {
  if (error?.response?.status === 401) {
    if (error?.response?.data?.code === 'token.expired') {
      cookies = parseCookies();
      const { 'ignite-auth.refreshToken': refreshToken} = cookies;

      api.post('/refresh', {
        refreshToken,
      }).then(response => {
        const { token } = response.data;
        setCookie(undefined, 'ignite-auth.token', token, nookieConfig)
        setCookie(undefined, 'ignite-auth.refreshToken', response.data.refreshToken, nookieConfig)

        api.defaults.headers['Authorization'] = `Bearer ${token}`;
      })
    } else {

    }
  }
})
