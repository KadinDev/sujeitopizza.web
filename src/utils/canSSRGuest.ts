
// ACESSO DE ROTAS SOMENTE PARA USUARIOS NAO LOGADOS
// SE VC ESTIVER LOGADO E TENTAR ACESSAR A TELA DE LOGIN POR EXEMPLO,
// SERA REDIRECIONADO PARA OUTRA TELA 

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

//funcao para paginas que só pode ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

    const cookies = parseCookies(ctx);

    // Se o cara tentar acessar a pagina porem tendo já um login salvo redirecionamos
    if(cookies['@sujeitopizza.token']){
      return {
        redirect:{
          destination: '/dashboard',
          permanent: false,
        }
      }
    }

    return await fn(ctx);
  }

}