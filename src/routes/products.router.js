import { Router } from "express";
import { ProductManager } from "../helpers/ProductManager.js";

const productsRouter = Router()


const Products = new ProductManager('./src/utils/Products.json')


productsRouter.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await Products.getProducts()

    if(!limit){
        res.status(200).json({ status: 'Success', message: 'Productos Obtenidos', payload: [...products] })
    } else {
        let arrayLimted = []
        for(let i = 0; i < limit; i++){
            arrayLimted.push(products[i])
        }
        res.status(200).json({ status: 'Success', message: 'Productos Obtenidos', payload: [...arrayLimted] })
    }
})

productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    const product = await Products.getProductsById(Number(pid))

    if(product.error){
        return res.status(404).json({status: 'Failed', message: 'Producto no encontrado', error: product.error})
    } else {
        return res.status(200).json({status: 'Success', message: 'Producto Obtenido', payload: [product]})
    }
})

productsRouter.post('/', async (req, res) => {
    const { title, description, price, stock, category, thumbnails } = req.body
    
    const newProductAdded = await Products.addProduct({
        title: title,
        description: description,
        price: price,
        stock: stock,
        category: category,
        thumbnails: thumbnails
    })

    if(newProductAdded?.error){
        return res.status(400).json({status: 'Failed', message: 'Faltan Datos', error: newProductAdded.error})
    } else {
        return res.status(200).json({status: 'Success', message: `Producto agregado con exito, Title: ${title}`})
    }
})

productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const data = req.body

    await Products.updateProduct({pid, data})
    return res.status(200).json({status: 'Success', message: `Producto modificado con exito`})
})

productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid

    await Products.deleteProduct({ pid })
    return res.status(200).json({status: 'Success', message: `Producto eliminado con exito`})

})

export default productsRouter