import { Router } from "express";
import { CartManager } from "../helpers/CartManager.js";

const cartsRouter = Router()


const Carts = new CartManager('./src/utils/Carts.json')


cartsRouter.post('/', async (req, res) => {
    const newCart = await Carts.createNewCart()
    res.status(200).json({status: 'Success', message: `Nuevo carrito creado con id: ${newCart[newCart.length - 1].id}`, payload: [...newCart]})
})


cartsRouter.get('/', async (req, res) => {
    const cart = await Carts.getAllCarts()

    if(cart.error){
        return res.status(404).json({status: 'Failed', message: 'No se han encontrado carritos', error: cart.error})
    } else {
        return res.status(200).json({status: 'Success', message: `${cart.length} Carritos obtenidos`, payload: [cart]})
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    const cart = await Carts.getCartById(Number(cid))

    if(cart.error){
        return res.status(404).json({status: 'Failed', message: 'Carrito no encontrado', error: cart.error})
    } else {
        return res.status(200).json({status: 'Success', message: 'Carrito Obtenido', payload: [cart]})
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    let newProduct = await Carts.addProduct({cid: Number(cid), pid: Number(pid)})

    if(newProduct?.error){
        return res.status(404).json({status: 'Failed', message: 'Producto no añadido', error: newProduct.error})
    }
    
    return res.status(200).json({status: 'Success', message: `Producto con id ${pid} registrado con exito en carrito con id ${cid}.`})
})

export default cartsRouter