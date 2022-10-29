import React, {useState, useEffect} from 'react'

import Head from 'next/head'
import {canSSRAuth} from '../../utils/canSSRAuth'
import styles from './styles.module.scss'
import { Header } from '../../components/Header'
import { ModalOrder } from '../../components/Modal'
import {FiRefreshCcw} from 'react-icons/fi'

import Modal from 'react-modal'

import { api } from '../../services/apiCLient'

interface OrderProps {
    id: string;
    table: string;
    status: boolean;
    draft: boolean;
    name: string
}

// tipando detalhes dos Items, do produto e do produto em si, e do Order
// para apresenta no Modal
export interface OrderItemProps {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;

    product: {
        id: string;
        name: string;
        description: string;
        banner: string
    };

    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard(){

    const [orders, setOrders] = useState<OrderProps[] | []>([])
    
    const [modalItem, setModalItem] = useState<OrderItemProps[]>()

    const [modalVisible, setModalVisible] = useState(false)


    useEffect(() => {
        async function loadAllOrders(){
            const response = await api.get('/orders')

            setOrders(response.data)
        }
        loadAllOrders()
    },[])

    async function loadLastOrders(){
        const response = await api.get('/orders')
        setOrders(response.data)
    }

    // pego o id do pedido que cliquei
    async function handleOpenModalView( id: string){
        const response = await api.get('/orders/details', {
            params: {
                order_id: id,
            }
        } )
        setModalItem(response.data)
        setModalVisible(true) // abrir modal
    }

    function handleCloseModal(){
        setModalVisible(false)
    }

    async function handleFinishOrder( id: string ){
        await api.put('/orders/finished', {
            order_id: id
        })

        const response = await api.get('/orders')

        setOrders(response.data)

        setModalVisible(false)
    }

    Modal.setAppElement('#__next')

    return (
       <>
        <Head>
            <title>Painel - Sujeito Pizzaria</title>
        </Head>

        <div>
            <Header/>

            <main className={styles.container}>

                <div className={styles.containerHeader} >
                    <h1>Últimos pedidos</h1>
                    <button onClick={loadLastOrders}>
                        <FiRefreshCcw color='#3fffa3' size={25} />
                    </button>
                </div>                

                {orders.length === 0 && (
                    <span className={styles.emptyList}>
                        Nenhum pedido aberto no momento!
                    </span>
                ) }

                {orders.map( (item) => {
                    return (
                        <article key={item.id} className={styles.listOrders}>
                            <section className={styles.orderItem}>
                                
                                <button onClick={ () => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span> Mesa {item.table} </span>
                                </button>
                            
                            </section>
                        </article>
                    )
                })}
                        

            </main>

            {
                modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestColse={handleCloseModal}
                        order={modalItem}
                        handleFinishOrderItem={handleFinishOrder}
                    />
                )
            }

        </div>
       </>
    )
}

// somente pessoas logadas poderão acessar essa pagina de Dashboard
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})