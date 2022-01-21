import express from "express"
import cors from "cors";
//import Contenedor from "./services/productos.js";          // mysql
//import Mensajes from "./services/mensajes.js";             // sqlite
import Mensajes from "./daos/messages/messageMongo.js"
import Usuarios from "./daos/users/userMongo.js"
import productRouter from "./routes/products.js"
import productTestRouter from "./routes/productsTest.js"
import cartRouter from "./routes/carts.js"
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import __dirname from "./utils.js";
import moment from "moment";
import { products } from "./daos/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import ios from "socket.io-express-session"
import passport from "passport";

const app = express();
export const port = process.env.PORT || 8080                           

const server = app.listen(port, ()=>{
    console.log(`Servidor escuchando en ${port} `)
})

const baseSession = (session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://rodrialisio:asd456@cluster0.a2jas.mongodb.net/sesiones?retryWrites=true&w=majority",
        ttl:10
    }),
    secret:"password",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:10}

}))

const mensajes = new Mensajes()
const users = new Usuarios()
export const io = new Server(server)
io.use(ios(baseSession))

const admin = true
app.use((req,res,next)=> {
    req.auth=admin
    next()
})

app.use(express.json())
app.use(baseSession)                                       
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

app.get("/logout", (req,res)=> {
    alert(`Hasta lugo ${req.session.user.userId}`)
    req.session= null   
})

app.get("/current-user", async (req,res)=> {
    console.log("user: ", req.session.user)
    res.send(req.session.user)
})

app.post("/register-user", async (req,res)=> {
    let userData = req.body
    let result = await users.registerUser(userData)
    res.send(result)
})

app.post("/login-user", async (req,res)=> {
    console.log(req.body)
    let {id, password} = req.body
    if (!id || !password) return res.status(400).send({message:"datos incompletos"})
    let search = await users.getUserById(id)
    if (!search.payload) return res.status(404).send(search)
    else if (search.payload[0].password !== password) return res.send({status:"error", message:"usuario o contraseña incorrecta"})
    req.session.user = {
        userId: search.payload[0].id,
        userName: search.payload[0].name
    }
    res.send({status:"success", message: `usuario ${req.session.user.userId} logueado`})
})

io.on("connection", async socket => {
    console.log(`El socket ${socket.id} se ha conectado.`)
    let productos = await products.getAll()
    socket.emit("updateProducts", productos)
    let messages = await mensajes.getMessages()
    socket.emit("messagelog",messages)
    socket.on("message", async data=> {
        const user = await users.getUserById(socket.handshake.session.user.userId)
        let time= moment()
        let message = {
            author: {
                id: user.payload[0].id
            },            
            text: data.message,
            time: time.format("DD/MM/YYYY HH:mm")
        }
        mensajes.registerMessage(message).then(result => {
            io.emit("messagelog",result)
        })    
    })
    socket.on("clearLog", ()=> {
        mensajes.clearLog().then(result=> {
            io.emit("messagelog",result)
        })
    })
})



