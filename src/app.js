import express from "express"
import cors from "cors";
//import Contenedor from "./services/productos.js";          // mysql
//import Mensajes from "./services/mensajes.js";             // sqlite
import Mensajes from "./daos/messages/messageMongo.js"
import Usuarios from "./daos/users/userMongo.js"
import productRouter from "./routes/products.js"
import productTestRouter from "./routes/productsTest.js"
import cartRouter from "./routes/carts.js"
import randomsRouter from "./routes/randoms.js"
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import __dirname from "./utils.js";
import moment from "moment";
import { products } from "./daos/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import ios from "socket.io-express-session"
import initializePassport from "./passport-config.js";
import passport from "passport";
import minimist from "minimist";
import dotenv from "dotenv"
import cluster from "cluster"
import core from "os"
import compression from "compression"
import {logger} from "./config.js"
import upload from "./services/upload.js"

dotenv.config()

const app = express();

let minimizedArgs= minimist(process.argv) 

let PORT
if (process.env.HEROKU_DEPLOY === "1") {
    PORT = process.env.PORT
} else {
    PORT = minimizedArgs.port || 8080
}
export let port = PORT

if (!minimizedArgs.mode) minimizedArgs.mode= "FORK"

let server
if (minimizedArgs.mode === "CLUSTER") {  
    if (cluster.isMaster) {
        console.log(`proceso primario - pid: ${process.pid}`)
        for (let i=0; i<core.cpus().length; i++) {
            cluster.fork()
        }
        cluster.on("exit",(worker,code,signal)=> {
            console.log(`worker ${worker.process.pid} caído`)
            cluster.fork()
            console.log(`worker restaurado`)
        })
    } else {
        server = app.listen(port, ()=>{
            console.log(`Servidor worker pid: ${process.pid} escuchando en ${port} `)
        })
    }
} else if (minimizedArgs.mode === "FORK") {
    server = app.listen(port, ()=> {
        console.log(`listening in ${port}`)
    })
}

const baseSession = (session({
    store: MongoStore.create({mongoUrl: process.env.MONGO_URL_SESSIONS, ttl:600}),
    secret:process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:600000}
}))

const mensajes = new Mensajes()
export const users = new Usuarios()
export const io = new Server(server)
io.use(ios(baseSession))

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
app.use("/api/randoms", randomsRouter)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get("/",async function (req,res) {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    res.render("Home")
})

app.get("/logout", (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    req.session.user= null
    req.logout()
    console.log("despues de logout: ",req.session)
})

app.get("/current-user", async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    res.send(req.session.user)
})

app.get("/info", compression(), (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    const info= {
        entry_arg: minimizedArgs._.slice(2),
        platform: process.platform,
        node_version: process.version,
        reserved_memory: process.memoryUsage(),
        execution_path: process.execPath,
        process_id: process.pid,
        proyect_folder: process.cwd(),
        cpus: cluster.isMaster? 1: core.cpus().length
    }
    res.render("info",info)
})

app.post("/register-user", upload.single("register-user-avatar"), passport.authenticate("register",{failureRedirect:"/failed-register"}), async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    res.send({status:"success", message:"usuario registrado exitosamente"})
})

app.get("/failed-register",(req,res)=> {
    res.send({status:"error"})
})

app.post("/login-user", passport.authenticate("login",{failureRedirect:"/failed-login"}),async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    req.session.user = {
        userId: req.user.id,
        userName: req.user.name
    }
    res.send({status:"success", message: "usuario logueado exitosamente"})
})

app.get("/failed-login",(req,res)=> {
    res.send({status:"error"})
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

app.get("*", (req, res, next) => {
    logger.warn(`ruta inexistente! Método: ${req.method} Ruta: ${req.url}`)
    next()
})
