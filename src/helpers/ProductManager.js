import fs from 'fs'


export class ProductManager {

    #error
    #path
    #format
    #currentProducts
    #productsActualization

    constructor(path){
        this.#path = path
        this.#format = 'utf-8'
        this.#error = null
        this.#currentProducts = []
        this.#productsActualization = []
    }

    #idGenerator = (currentProducts) => {
        //Esto es para que no se repitan los ID en caso de eliminacion de producto
        if(currentProducts.length === 0){
            return 1
        } else {
            return currentProducts[currentProducts.length - 1].id + 1
        }
    }

    getProducts = async () => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            this.#error = 'No existe el archivo de productos'
            return `Error: ${this.#error}`
        } else {
            return JSON.parse( await fs.promises.readFile(this.#path, this.#format))
        }
    }

    addProduct = async ({ title, description, price, stock, category, thumbnails }) => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            await fs.promises.writeFile(this.#path, JSON.stringify([]))
        }

        let currentProducts = await this.getProducts()

        let id = this.#idGenerator(currentProducts)

        
        this.#productsActualization.push(
            ...currentProducts,
            {
                id: id, 
                title,
                description,
                code: `${1000 + id}`, 
                price,
                status: true,
                stock,
                category,
                thumbnails
            }
        )

        return await fs.promises.writeFile(this.#path, JSON.stringify(this.#productsActualization, null, '\t'))
    }

    getProductsById = async (id) => {
        let currentProducts = await this.getProducts()

        let find = currentProducts.find(el => el.id === id)

        if(find){
            return find
        } else {
            this.#error = 'ID no encontrado'
            return {error: `${this.#error}`}
        }
    }

    updateProduct = async ({ pid, data }) => {
        let currentProducts = await this.getProducts()
        const prodIndex = currentProducts.findIndex(item => item.id == pid)

        currentProducts[prodIndex] = { ...currentProducts[prodIndex], ...data }

        
        return await fs.promises.writeFile(this.#path, JSON.stringify(currentProducts, null, '\t'))
    }

    deleteProduct = async ({pid}) => {
        let currentProducts = await this.getProducts()

        let newArray = [...currentProducts.filter(el => el.id != pid)]

        return await fs.promises.writeFile(this.#path, JSON.stringify(newArray, null, '\t'))
    }
}