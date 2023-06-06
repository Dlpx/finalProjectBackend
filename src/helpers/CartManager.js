import fs from 'fs'
import { ProductManager } from './ProductManager.js'


export class CartManager {


    #path
    #format
    #error


    constructor(path){
        this.#path = path
        this.#format = 'utf-8'
        this.#error = null
    }
    

    createNewCart = async () => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            await fs.promises.writeFile(this.#path, JSON.stringify( [{id: 1, products: []}], null, '\t' ))
        } else {
            let currentCarts = JSON.parse( await fs.promises.readFile(this.#path, this.#format))

            currentCarts.push({id: currentCarts[currentCarts.length - 1].id + 1, products: []})

            await fs.promises.writeFile(this.#path, JSON.stringify( [...currentCarts], null, '\t' ))
        }
        
        return JSON.parse( await fs.promises.readFile(this.#path, this.#format))        
    }

    getAllCarts = async () => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            this.#error = 'No existen carritos'
            return {error: `${this.#error}`}
        } else {
            return JSON.parse( await fs.promises.readFile(this.#path, this.#format) )
        }
    }

    getCartById = async (cid) => {
        let currentCarritos = await this.getAllCarts()

        if(currentCarritos.error){
            this.#error = 'No hay Carritos'
            return {error: this.#error}
        }
        
        let found = currentCarritos.find(item => item.id === cid)


        if(!found){
            this.#error = `ID: ${cid} no encontrado`
            return {error: `${this.#error}`}
        } else {
            return found
        }

    }

    addProduct  = async ({cid, pid}) => {
        let allCarts = await this.getAllCarts()

        if(allCarts.error){
            return {error: allCarts.error}
        }
        
        let cartIndex = allCarts.findIndex(item => item.id === cid)

        if(cartIndex === -1){
            this.#error = `No se encontro el carrito con id ${cid}`
            return {error: this.#error}
        }

        const Products = new ProductManager('./src/utils/Products.json')
        let allProducts = await Products.getProducts()
        const findProduct = allProducts.find(item => item.id === pid)
        if(!findProduct){
            this.#error = `Producto con id: ${pid} no encontrado`
            return {error: this.#error}
        }

        let currentCart = allCarts[cartIndex]


        if(currentCart.products.length <= 0) {
            currentCart.products.push({product: pid, quantity: 1})
            allCarts[cartIndex] = currentCart

            return await fs.promises.writeFile(this.#path, JSON.stringify(allCarts, null, '\t'))
        }

        let itemOnCart = currentCart.products.find(item => item.product === pid)


        if(itemOnCart) {
            let productIndex = currentCart.products.findIndex(item => item.product == pid)  
            itemOnCart.quantity = itemOnCart.quantity + 1
            allCarts[cartIndex].products[productIndex] = itemOnCart

            return await fs.promises.writeFile(this.#path, JSON.stringify(allCarts, null, '\t'))
        } else {
            currentCart.products.push({product: pid, quantity: 1})
            allCarts[cartIndex] = currentCart

            return await fs.promises.writeFile(this.#path, JSON.stringify(allCarts, null, '\t'))
        }
    }
}