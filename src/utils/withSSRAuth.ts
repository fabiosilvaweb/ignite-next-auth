import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export function withSSRAuth<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (!cookies['ignite-auth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx)
    } catch(error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(undefined, 'ignite-auth.token')
        destroyCookie(undefined, 'ignite-auth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }

      return {
        redirect: {
          destination: "/error",
          permanent: false,
        },
      };
    }
  }
}
