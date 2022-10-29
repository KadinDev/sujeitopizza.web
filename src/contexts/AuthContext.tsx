import { createContext, ReactNode, useState, useEffect } from 'react'

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import {toast} from 'react-toastify'

import { api } from '../services/apiCLient'

type AuthContextData = {
    user: UserProps | undefined;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps ) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext( {} as AuthContextData )


// DESLOGAR USUARIO
export function signOut(){
    try {
        // limpar o token
        // @sujeitopizza.token (é o mesmo que vc criou em api.ts)
        destroyCookie(undefined, '@sujeitopizza.token' )

        Router.push('/') // redireciona o usuario para a tela de login

    } catch (error) {
        console.log('Erro ao deslogar usuário')
    }
}

export function AuthProvider({ children } : AuthProviderProps ){

    const [user, setUser] = useState<UserProps>()
    
    // !! assim converto a variavel de user em bollean
    // se user estiver vazio(), será false
    // se estiver algo dentro será true
    const isAuthenticated = !!user;

    useEffect(() => {

        // tentar pegar algo no cookie
        const { '@sujeitopizza.token' : token } = parseCookies()

        // se tem algum token
        if(token){
            // /me foi a rota que fiz pra salvar informações do user logado
            api.get('/me').then(response => {

                const {id, name, email} = response.data

                setUser({
                    id,
                    name,
                    email 
                })
            })
            .catch(() => {
                // se deu erro deslogamos o usuario
                signOut();
            })
        }

    },[])

    // LOGANDO USUARIIO
    async function signIn( {email, password} : SignInProps ){
        try {
            const response = await api.post('/session', {
                email,
                password
            })
            
            const {id, name, token} = response.data

            setCookie(undefined, '@sujeitopizza.token', token, {
                maxAge: 60 * 60 * 24 * 30, // o token vai expirar em 1 mês
                path: '/' // quais caminhos terão acesso ao token, como coloquei '/', todas as pages terão acesso ao token
            } )

            setUser({
                id,
                name,
                email
            })

            // passar para as proximas requisições(páginas) o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

            //Redirecionar o user para /dashboard
            Router.push('/dashboard')

        } catch (error) {
            toast.error('Erro ao fazer login!')
            console.log('ERRO AO ACESSAR', error)
        }
    }

    // CRIANDO USUARIO
    async function signUp({name, email, password} : SignUpProps){
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Cadastro realizado, seja bem vindo!')
            Router.push('/')

        } catch (error) {
            toast.error('Erro ao cadastrar!')
            console.log('Error no cadastro')
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn , signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}

// COLOCA ESSE AUTHCONTEXT NO _app.tsx, PQ ELE ESTA SEM VOLTA DE TODA A APLICAÇÃO