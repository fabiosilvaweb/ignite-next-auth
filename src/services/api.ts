import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { nookieConfig } from '../config/nookie';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from '../errors/AuthTokenError';

interface ApiResponseError {
  code: string
}


let isRefreshing = false
let failedRequestQueue: any[] = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: `Bearer ${cookies['ignite-auth.token']}`
    }
  });

  api.interceptors.response.use(response => response, (error: AxiosError<ApiResponseError>) => {
    if (error?.response?.status === 401) {
      if (error?.response?.data?.code === 'token.expired') {
        cookies = parseCookies();
        const { 'ignite-auth.refreshToken': refreshToken} = cookies;

        let originalConfig = error?.config

        if(!isRefreshing) {
          isRefreshing = true

          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data;
            setCookie(ctx, 'ignite-auth.token', token, nookieConfig)
            setCookie(ctx, 'ignite-auth.refreshToken', response.data.refreshToken, nookieConfig)

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestQueue?.forEach(request => request.onSuccess(token))
            failedRequestQueue = []
          }).catch((error) => {
            failedRequestQueue?.forEach(request => request.onFailure(error))
            failedRequestQueue = []

            if (typeof window !== 'undefined') {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {

              originalConfig = {
                ...originalConfig,
                headers: {
                  ...originalConfig?.headers,
                  ['Authorization']: `Bearer ${token}`
                }
              }

              resolve(api(originalConfig))
            },
            onFailure: (error: AxiosError) => {
              reject(error)
            },
          })
        })
      } else {
        if (typeof window !== 'undefined') {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }

      }
    }

    return Promise.reject(error);
  })

  return api
}
