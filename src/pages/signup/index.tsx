import {FormEvent, useContext, useState} from 'react'
import {AuthContext} from '../../contexts/AuthContext'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../../styles/home.module.scss'
import logoImg from '../../../public/logo.svg'

import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import {toast} from 'react-toastify'

export default function SignUp(){

  const {signUp} = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [load, setLoad] = useState(false)

  async function handleRegister( event: FormEvent ){
    event?.preventDefault();
    
    if(email === '' || password === '' || name === ''){
      toast.error('campos vazios não são permitidos')
      return 
    }

    setLoad(true)

    // estou mandando uma uma var chamada data
    // pega o envio em AuthContext
    let data = {
      name, email, password
    }

    await signUp(data)

    setLoad(false)
  }


  return (
    <>
      <Head>
        <title> Sujeito Pizza - faça seu cadastro </title>
      </Head>

      <div className={styles.containerCenter} >
        <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

        <div className={styles.login}>

          <h1 className={styles.titleForm}>Cadastro</h1>

          <form onSubmit={handleRegister}>
            <Input
              placeholder='Digite seu nome'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value) }
            />

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
              loading={false}
            >
              Criar conta
            </Button>

          </form>
        
            <Link href='/'>
                <a className={styles.text} > fazer meu login </a>
            </Link>
        
        </div>
      </div>
    </>
  )
}
