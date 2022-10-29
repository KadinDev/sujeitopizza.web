import axios, { AxiosError } from "axios"
import { parseCookies } from 'nookies' //pegar token de user logado em cookies

import { AuthTokenError } from './errors/AuthTokenError'

import { signOut } from '../contexts/AuthContext'

export function setupApiClient(ctx = undefined){

    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'http://localhost:3333/',
        
        
        headers: {
            Authorization: `Bearer ${cookies['@sujeitopizza.token']}`
        }
    })


    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if(error.response?.status === 401){
            // Qualquer erro API 401 (não autozizado), devemos deslogar o usuario

            if(typeof window !== undefined){
                // chamar a função para deslogar o usuário
                signOut()

            } else {
                return Promise.reject( new AuthTokenError() )
            }
        }

        return Promise.reject(error)

    } )

    return api
}