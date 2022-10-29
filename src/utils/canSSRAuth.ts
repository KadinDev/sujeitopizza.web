
// ACESSO DE ROTAS SOMENTE PARA USUARIOS LOGADOS 

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies, destroyCookie } from 'nookies'

import {AuthTokenError} from '../services/errors/AuthTokenError'

// função para páginas onde so user logado poderá ter acesso
export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        
        const cookies = parseCookies(ctx);

        const token = cookies['@sujeitopizza.token']

        if(!token){
            return {
                redirect:{
                destination: '/',
                permanent: false,
                }
            }
        } 
        
        try {
            return await fn(ctx)
        } catch (error) {
            if(error instanceof AuthTokenError){
                // limpar o token
                destroyCookie(ctx, '@sujeitopizza.token')

                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }

    }
}