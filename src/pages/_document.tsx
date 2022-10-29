// esse aqui vamos criar uma estrutura que vai ser renderizada uma UNICA vez
// quando rodar a aplicação

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(){
    return (
        <Html>
            <Head>

            </Head>

            <body>
                <Main/>
                <NextScript/>
            </body>

        </Html>
    )
}