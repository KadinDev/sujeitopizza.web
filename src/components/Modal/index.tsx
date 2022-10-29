import React from 'react'
import styles from './styles.module.scss'
import Modal from 'react-modal'

import { FiX } from 'react-icons/fi'
import {OrderItemProps} from '../../pages/dashboard'

interface ModalOrderProps {
    isOpen: boolean;
    onRequestColse: () => void;
    handleFinishOrderItem: (id: string) => void;
    order: OrderItemProps[];
}

export function ModalOrder( {onRequestColse, order, isOpen, handleFinishOrderItem} : ModalOrderProps ){

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            backgroundColor: '#1d1d2e',
            transform: 'translate(-50%, -50%)',
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestColse}
            style={customStyles}
        >

            <button
            type='button'
            onClick={onRequestColse}
            className='react-modal-close'
            style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={40} color='#f3474b' />
            </button>

            <div className={styles.container}>

                <h2>Detalhes do pedido</h2>
                <span className={styles.table}>
                    Mesa: <strong> { order[0].order.table } </strong> 
                </span>

                {
                    order.map( item => (
                        <section key={item.id} className={styles.containerItem}>

                            <span> {item.amount} - <strong>{item.product.name}</strong>  </span>

                            <span className={styles.description}> {item.product.description} </span>

                        </section>
                    ))
                }

                <button 
                    className={styles.buttonOrder} 
                    onClick={() => handleFinishOrderItem(order[0].order_id) }
                >
                    
                    Concluir pedido
                </button>
            
            </div>

        </Modal>
    )
}