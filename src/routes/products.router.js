import { Router } from "express";
import { ProductManager } from "../helpers/ProductManager.js";
import { multerUploader } from "../utils.js";

const productsRouter = Router()



const Products = new ProductManager('./src/utils/Products.json')

productsRouter.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await Products.getProducts()

    if(!limit){
        return res.render('home', {
            nombre__vista: 'Home - Products',
            products: products,
        });
        // res.status(200).json({ status: 'Success', message: 'Productos Obtenidos', payload: [...products] })
    } else {
        let arrayLimted = []
        for(let i = 0; i < limit; i++){
            arrayLimted.push(products[i]);
        };
        return res.render('home', {
            nombre__vista:'Home - Products',
            products:arrayLimted,
        });
        // res.status(200).json({ status: 'Success', message: 'Productos Obtenidos', payload: [...arrayLimted] })
    }
})

productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    let product = await Products.getProductsById(Number(pid))

    if(product.error){
        return res.render('error404', {
            nombre__vista:'ERROR - 404 not Found',
            status:'Failed',
            message: 'Producto no encontrado',
            error: product.error
        });
        // return res.status(404).json({status: 'Failed', message: 'Producto no encontrado', error: product.error})
    } else {
        res.render('home', {
            nombre__vista:'Home - Products',
            products:[product],
        });
        // return res.status(200).json({status: 'Success', message: 'Producto Obtenido', payload: [product]})
    }
})

//Aca quiero que primero se intente subir el archivo, y que luego vaya la imagen, porque sino en cada validacion se me va a estar subiendo un archivo nuevo a las imagenes.. 
productsRouter.post('/', multerUploader.single('fotoProd'), async (req, res) => {
    const { title, description, price, stock, category } = req.body
    
    if(!req.file) return res.status(400).json({status: 'Failed', message: "Falta la foto"})

    const thumbnails = req.file.filename

    const newProductAdded = await Products.addProduct({
        title: title,
        description: description,
        price: price,
        stock: stock,
        category: category,
        thumbnails: thumbnails
    })

    if(newProductAdded?.error){
        console.log(req.file)
        return res.status(400).json({status: 'Failed', message: 'Faltan Datos', error: newProductAdded.error})
    } else {
        console.log(req.file)
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