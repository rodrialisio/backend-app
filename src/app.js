import express from "express"
import cors from "cors";
import Contenedor from "./classes/contenedor.js"
import productRouter from "./routes/products.js"
import userRouter from "./routes/users.js"
import {engine} from "express-handlebars"


const app = express();
const port = process.env.PORT || 8080                           

const server = app.listen(port, ()=>{
    console.log(`Servidor escuchando en ${port} `)
})

const contenedor = new Contenedor()

app.use(express.json());                                        
app.use(express.urlencoded({extended:true}))                    
app.use(express.static("public"))        
app.use(cors())
app.use("/api/productos", productRouter)
app.use("/api/usuarios", userRouter)

// PARA UTILIZAR HANDLEBARS:

app.engine("handlebars",engine())
app.set("views","./viewsHandlebars")
app.set("view engine","handlebars") 
let message= "(Esto es Handlebars)"

// PARA UTILIZAR PUG:

/* app.set("views","./viewsPug")
app.set("view engine","pug")
let message= "(Esto es Pug)" */

// PARA UTILIZAR EJS:

/* app.set("views","./viewsEjs")
app.set("view engine","ejs")
let message= "(Esto es EJS)" */


app.get("/",(req,res)=> {
    res.render("Home",{engine: message})
})

app.use((req,res,next)=> {
    let timestamp = Date.now()
    let time = new Date(timestamp)
    console.log("Request made at "+time.toTimeString())
    next()
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















