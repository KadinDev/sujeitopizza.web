
// Nesse arquivo eu coloco o que eu quero que se repita em todas as páginas

import '../../styles/global.scss'

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from '../contexts/AuthContext'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      
      <ToastContainer autoClose={3000} />
    </AuthProvider>
  ) 
}

export default MyApp
