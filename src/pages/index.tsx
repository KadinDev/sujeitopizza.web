import {FormEvent, useContext, useState} from 'react'
import {AuthContext} from '../contexts/AuthContext'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/home.module.scss'
import logoImg from '../../public/logo.svg'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import {toast} from 'react-toastify'


import { canSSRGuest } from '../utils/canSSRGuest'

 
export default function Home(){

  const {signIn} = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [load, setLoad] = useState(false)


  async function handleLogin( event: FormEvent ){
    event?.preventDefault();
    
    if(email === '' || password === ''){
      toast.error('campos vazios não são permitidos')
      return 
    }

    setLoad(true)

    // estou mandando uma uma var chamada data
    // pega o envio em AuthContext
    let data = {
      email, password
    }

    await signIn(data)

    setLoad(false)
  }

  return (
    <>
      <Head>
        <title> Sujeito Pizza - faça seu login </title>
      </Head>

      <div className={styles.containerCenter} >
        <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

        <div className={styles.login}>
          
          <form onSubmit={handleLogin} >

            <Input
              placeholder='Digite seu email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value) }
            />

            <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value) }
            />

            <Button
              type='submit'
              loading={load}
            >
              Fazer meu login
            </Button>

          </form>

          <div className={styles.links}>
            <Link href='/signup'>
                <a className={styles.text} > criar uma conta </a>
            </Link>

            <Link href='/'>
                <a className={styles.text} > esqueci minha senha </a>
            </Link>

          </div>
        
        </div>
      </div>
    </>
  )
}


// Configuração de ROTA PRIVADA, feita nesse arquivo canSSRGuest
// Só consigo o acesso a pagina de LOGIN se eu nao estiver logado, se eu estiver serei
// redirecionado para outra tela
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})