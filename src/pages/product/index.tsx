import styles from './styles.module.scss'

import {useState, FormEvent, ChangeEvent, useEffect } from 'react'

import Head from "next/head";

import { Header } from '../../components/Header';

import { api } from '../../services/apiCLient'

import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi'

import {canSSRAuth} from '../../utils/canSSRAuth'

type CategoryProps = {
    id: string;
    name: string;
}
  

// essa categoryList, foi a que mandei como props as categorias carregadas, no final desse arquivo
export default function Product(){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [categories, setCategories] = useState<CategoryProps[]>([])
    const [categorySelected, setCategorySelected] = useState(0) // categoria selecionada

    useEffect(() => {
        async function loadCategories(){
            const response = await api.get('/categories')

            setCategories(response.data)
            setCategorySelected(response.data[0]) // pega o primeiro item e coloca como selecionada
        }
        loadCategories()
    },[])


    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
          return;
        }
    
        const image = e.target.files[0];
    
        if(!image){
          return;
        }
    
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
    
          setImageAvatar(image as any);
          setAvatarUrl(URL.createObjectURL(e.target.files[0])) // criando preview da imagem
        }
    }

    async function handleRegisterProduct( event : FormEvent ){
        event.preventDefault()

        try {

            // FormData(), é o multipart forma data, que conhecemos no insomnia
            // para enviar varios arquivos e imagem junto
            const data = new FormData()
            
            if(name === '' || price === '' || description === ''){
                toast.error('Campo vazio não é permitido!')
                return
            }

            // os mesmos nomes que foi criado no backend
            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('category_id', categories[categorySelected].id )
            data.append('file', imageAvatar)

            await api.post('/product', data )
            toast.success('Produto cadastrado com sucesso!')

        } catch (error) {
            console.log(error)
            toast.error('Erro ao cadastrar produto')
        }

        
        setName('')
        setPrice('')
        setDescription('')
        setAvatarUrl('')
        setCategorySelected(0)
        
    }

    function handleChangeCategory(event){
        setCategorySelected(event.target.value)
    }

    return (
        <>
            <Head>
                <title>Novo Produto - Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header/>

                <main className={styles.container}>
                    <h1>Cadastrar produto</h1>

                    <form 
                        className={styles.form}
                        onSubmit={handleRegisterProduct}
                    >

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={35} color='#FFF' />
                            </span>

                            <input 
                                type="file" 
                                accept='image/png, image/jpeg' 
                                onChange={handleFile}
                            />

                            { avatarUrl && (
                                <img className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do produto"
                                    width={250}
                                    height={250}
                                />
                            ) }

                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory} >
                            {categories.map( (item, index ) => {
                                return(
                                    <option key={item.id} value={index}>
                                    {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input 
                        type="text" 
                        placeholder='Digite o nome do produto'
                        className={styles.input}
                        value={name}
                        onChange={ (e) => setName(e.target.value) }
                        />

                        <input 
                        type="text" 
                        placeholder='Digite o preço do produto'
                        className={styles.input}
                        value={price}
                        onChange={ (e) => setPrice(e.target.value) }
                        />

                        <textarea
                            className={styles.input}
                            placeholder='Descreva seu produto...'
                            value={description}
                            onChange={ (e) => setDescription(e.target.value) }
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

/* Como esse é o primeiro a ser carregado quando entro nessa pagina
eu carrego as categorias da forma feita abaixo */
export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {
        props: {
            
        }
    }
})