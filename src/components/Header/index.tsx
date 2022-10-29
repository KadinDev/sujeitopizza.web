import {useContext} from 'react'

import Link from 'next/link'
import styles from './styles.module.scss'

import logoImg from '../../../public/logo.svg'
import Image  from 'next/image'
import { FiLogOut } from 'react-icons/fi'

import {AuthContext} from '../../contexts/AuthContext'

export function Header(){

    const {signOut} = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>

            <div className={styles.headerContent}>
                <Link href='/'>
                    <Image src={logoImg} alt="Logo Sujeito Pizzaria" width={190} height={90} />
                </Link>


                <nav className={styles.menu}>
                    <Link href='/category'>
                        <a>Categorias</a>
                    </Link>

                    <Link href='/product'>
                        <a>Cardapio</a>
                    </Link>
                
                    <button onClick={signOut}>
                        <FiLogOut color='#FFF' size={24} />
                    </button>
                
                </nav>
                
            </div>
        </header>
    )
}