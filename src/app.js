import express from "express"
import cors from "cors";
//import Contenedor from "./services/productos.js";          // mysql
//import Mensajes from "./services/mensajes.js";             // sqlite
import Mensajes from "./daos/messages/messageMongo.js"
import productRouter from "./routes/products.js"
import productTestRouter from "./routes/productsTest.js"
import cartRouter from "./routes/carts.js"
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import __dirname from "./utils.js";
import moment from "moment";
import { products } from "./daos/index.js";

const app = express();
export const port = process.env.PORT || 8080                           

const server = app.listen(port, ()=>{
    console.log(`Servidor escuchando en ${port} `)
})

const mensajes = new Mensajes()
export const io = new Server(server)

const admin = true
app.use((req,res,next)=> {
    req.auth=admin
    next()
})

app.use(express.json());                                        
app.use(express.urlencoded({extended:true}))                    
app.use(express.static(__dirname+"/public"))        
app.use(cors())
app.engine("handlebars",engine())
app.set("views",__dirname+"/views")
app.set("view engine","handlebars") 

app.use((req,res,next)=> {
    let timestamp = Date.now()
    let time = new Date(timestamp)
    console.log("Request made at "+time.toTimeString())
    next()
})

app.use("/api/productos", productRouter)
app.use("/api/productos-test",productTestRouter)
app.use("/api/carritos", cartRouter)

app.get("/",async function (req,res) {
    res.render("Home")
})

app.get("/productoRandom", async (req,res)=> {
    const products = await contenedor.getAllProducts()
    if (products.status==="success") { 
        console.log("success")
        res.status(200).send(products.payload[Math.floor(Math.random()*products.payload.length)])
    } else {
        res.status(500).send(products.message)
    }
})

io.on("connection", async socket => {
    console.log(`El socket ${socket.id} se ha conectado.`)
    let productos = await products.getAll()
    socket.emit("updateProducts", productos)
    let messages = await mensajes.getMessages()
    socket.emit("messagelog",messages)
    socket.on("message",data=> {
        let time= moment()
        data.time= time.format("DD/MM/YYYY HH:mm")
        mensajes.registerMessage(data).then(result => {
            io.emit("messagelog",result)
        })    
    })
    socket.on("clearLog", ()=> {
        mensajes.clearLog().then(result=> {
            io.emit("messagelog",result)
        })
    })
})



