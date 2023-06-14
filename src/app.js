import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";

const PORT = 8080;


const app = express();
app.use(express.json());
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
app.use(express.static('./src/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
    console.log('neu user connected');

    socket.emit('conectSuccess', {message: 'You are connected'});
});



