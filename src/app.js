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
import initializePassportConfig from "./passport-config.js";
import passport from "passport";
import minimist from "minimist";
import dotenv from "dotenv"
import cluster from "cluster"
import core from "os"
import os from "os"

dotenv.config()

const app = express();

const minimizedArgs= minimist(process.argv) 
export let port = minimizedArgs.port || 8080

let server

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

const baseSession = (session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL_SESSIONS,
        ttl:600
    }),
    secret:process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:600000}
}))

const mensajes = new Mensajes()
export const users = new Usuarios()
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
app.use("/api/randoms", randomsRouter)

initializePassportConfig()
app.use(passport.initialize())
app.use(passport.session())

app.get("/auth/facebook", passport.authenticate("facebook"/* ,{scope:["email","displayName","photos"]} */),(req,res)=> {
})

app.get("/auth/facebook/callback", passport.authenticate("facebook",{failureRedirect:"/facebook-login-fail"}), (req,res)=>{
    req.session.user = {
        userId: req.user.id,
        userName: req.authInfo.displayName,
        userPicture: req.authInfo.picture.value
    }
    res.redirect("/pages/chat.html")
})

app.get("/facebook-login-fail", (req,res)=> {  
    res.send({error:"Hubo un error de conexión!"})
})

app.get("/",async function (req,res) {
    res.render("Home")
})

app.get("/logout", (req,res)=> {
    req.logout()
})

app.get("/current-user", async (req,res)=> {
    res.send(req.session.user)
})

app.get("/info", (req,res)=> {
    const info= {
        entry_arg: minimizedArgs._.slice(2),
        platform: process.platform,
        node_version: process.version,
        reserved_memory: process.memoryUsage(),
        execution_path: process.execPath,
        process_id: process.pid,
        proyect_folder: process.cwd(),
        cpus: os.cpus().length
    }
    res.render("info",info)
})

app.post("/register-user", async (req,res)=> {
    let userData = req.body
    let result = await users.registerUser(userData)
    res.send(result)
})

app.post("/login-user", async (req,res)=> {
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
