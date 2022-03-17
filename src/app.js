import express from "express"
import cors from "cors"
import Mensajes from "./daos/messages/messageMongo.js"
import Usuarios from "./daos/users/userMongo.js"
import productRouter from "./routes/products.js"
import productTestRouter from "./routes/productsTest.js"
import cartRouter from "./routes/carts.js"
import randomsRouter from "./routes/randoms.js"
import logoutRouter from  "./routes/logout.js"
import currentUserRouter from "./routes/currentUser.js"
import registerUserRouter from "./routes/registerUser.js"
import failedRegisterRouter from "./routes/failedRegister.js"
import loginUserRouter from "./routes/loginUser.js"
import failedLoginRouter from "./routes/failedLogin.js"
import infoRouter from "./routes/info.js"
import pedidosRouter from "./routes/pedidos.js"
import {engine} from "express-handlebars"
import {Server} from "socket.io"      
import __dirname from "./utils.js";
import { products } from "./daos/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import ios from "socket.io-express-session"
import initializePassport from "./passport-config.js";
import passport from "passport"
import minimist from "minimist";
import dotenv from "dotenv"
import cluster from "cluster"
import core from "os"
import {logger} from "./config.js"
import { appSocket } from "./contenedores/appSocket.js"

dotenv.config()

const app = express();

export let minimizedArgs= minimist(process.argv) 

export let port = process.env.HEROKU_DEPLOY === "1"? process.env.PORT : minimizedArgs.port || 8080

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
} else {
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

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/register-user",registerUserRouter)
app.use("/failed-register", failedRegisterRouter)
app.use("/login-user", loginUserRouter)
app.use("/failed-login", failedLoginRouter)
app.use("/current-user", currentUserRouter)
app.use("/api/productos", productRouter)
app.use("/api/productos-test",productTestRouter)
app.use("/api/carritos", cartRouter)
app.use("/pedido", pedidosRouter)
app.use("/api/randoms", randomsRouter)
app.use("/info", infoRouter)
app.use("/logout", logoutRouter)

app.get("/",async function (req,res) {
    logger.info(`Método: ${req.method} Ruta: ${req.url}`)
    res.render("Home")
})

app.get("*", (req, res, next) => {
    logger.warn(`ruta inexistente! Método: ${req.method} Ruta: ${req.url}`)
    next()
})


appSocket(server,products,mensajes,users,baseSession,io)

