const fs= require("fs")
const express = require('express');
const cors = require("cors")
const Contenedor = require("./classes/contenedor.js")
const app = express();

const port = process.env.PORT || 8080                           
const server = app.listen(port, ()=>{
    console.log(`Servidor escuchando en ${port} `)
})

const contenedor = new Contenedor()
const productRouter = require("./routes/products")
const userRouter = require("./routes/users")

app.use(express.json());                                        
app.use(express.urlencoded({extended:true}))                    //??
app.use(express.static("public"))
app.use("/images",express.static(__dirname+"/public/images"))         
app.use(cors())
app.use("/api/productos", productRouter)
app.use("/api/usuarios", userRouter)
/* app.engine(".420",(route,object,cb)=> {
    fs.promises.readFile(route,(err,content)=> {

    })
}) */

app.use((req,res,next)=> {
    let timestamp = Date.now()
    let time = new Date(timestamp)
    console.log("Request made at "+time.toTimeString())
    next()
})

app.get("/",(req,res)=> {
    res.send("Home")
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















