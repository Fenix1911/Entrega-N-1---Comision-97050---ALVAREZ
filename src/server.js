import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import viewsRouter from "./routes/views_routes.js";
import productsRouter from "./routes/products_routes.js";
import cartsRouter from "./routes/carts_routes.js";
import sessionsRouter from "./routes/sessions_routes.js";

import ProductDAO from "./dao/ProductDAO.js";

import passport from "./config/passport.js";
import cookieParser from "cookie-parser";


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);



mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB conectado");
})
.catch(err => console.error(err));



const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});


const io = new Server(httpServer);

app.set("io", io);

const productDAO = new ProductDAO();


io.on("connection", async (socket) => {

    console.log("Nuevo cliente conectado");

    const result = await productDAO.getAll({}, { lean: true });

    socket.emit("initialProducts", result.docs);

});