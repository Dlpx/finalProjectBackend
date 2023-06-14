import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";

const PORT = 8080;

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

const app = express();
app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);






app.listen(PORT, () => console.log(`Server running on port ${PORT}`));