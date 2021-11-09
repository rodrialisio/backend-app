const express= require("express")
const Contenedor = require("./classes/contenedor.js")

const app = express()

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT} `)
})

const contenedor = new Contenedor()

app.get("/",(req,res)=> {
    res.send("home")
})

app.get("/productos", async (req,res)=> {
    const products = await contenedor.getAllProducts()
    if (products.status==="success") {
            res.status(200).send(products.payload)
    } else {
        res.status(500).send(products.message)
    }
}) 

app.get("/usuarios",async (req,res)=> {             // no requerido para el desafío
    const users = await contenedor.getAllUsers()
    if (users.status==="success") {
            res.status(200).send(users.payload)
    } else {
        res.status(500).send(users.message)
    }
}) 

app.get("/usuarios/:nombre", async (req,res)=> {    // no requerido en el desafío
    const users = await contenedor.getAllUsers()
    if (users.status==="success") {
        res.status(200).send(users.payload.find(item=> item.nombre===req.params.nombre))
    } else {
        res.status(500).send(users.message)
    }
}) 

app.get("/productos/:title", async (req,res)=> {    // no requerido en el desafío
    const products = await contenedor.getAllProducts()
    if (products.status==="success") {
        res.status(200).send(products.payload.find(item=> item.title===req.params.title))
    } else {
        res.status(500).send(products.message)
    }
})

app.get("/productoRandom", async (req,res)=> {
    const products = await contenedor.getAllProducts()
    if (products.status==="success") { 
        res.status(200).send(products.payload[Math.floor(Math.random()*products.payload.length)])
    } else {
        res.status(500).send(products.message)
    }
})





