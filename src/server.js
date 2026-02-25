import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import viewsRouter from './routes/views_routes.js';
import productsRouter from './routes/products_routes.js';
import cartsRouter from './routes/carts_routes.js';
import ProductManager from './dao/ProductManager.js';

import passport from './config/passport.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions_routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


mongoose.connect(
  "mongodb+srv://Admin:1234@cluster0.es44nfk.mongodb.net/entregaFinal?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Atlas conectado"))
.catch(err => console.error(err));


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "public")));



app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080");
});


const io = new Server(httpServer);

app.set('io', io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    const result = await ProductManager.getProducts({}, { lean: true });
    socket.emit("initialProducts", result.docs);
});
