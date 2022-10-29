import styles from './styles.module.scss'

import {useState, FormEvent} from 'react'

import Head from "next/head";
import { Header } from '../../components/Header';

import { api } from '../../services/apiCLient'
import { toast } from 'react-toastify';

import {canSSRAuth} from '../../utils/canSSRAuth'

export default function Category(){

    const [name, setName] = useState('')

    async function handleRegisterCategory( event : FormEvent ){
        event.preventDefault()

        if(name === ''){
            toast.error('Campo vazio não é permitido!')
            return
        }

        await api.post('/category', {
            name: name
        })

        toast.success('Nova categoria cadastrada!')
        
        setName('')
    }

    return (
        <>
            <Head>
                <title>Nova Categoria - Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header/>

                <main className={styles.container}>
                    <h1>Cadastrar categoria</h1>

                    <form 
                        className={styles.form}
                        onSubmit={handleRegisterCategory}
                    >
                        <input 
                        type="text" 
                        placeholder='Digite o nome da categoria'
                        className={styles.input}
                        value={name}
                        onChange={ (e) => setName(e.target.value) }
                        />

                        <button type='submit' className={styles.button}>
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})