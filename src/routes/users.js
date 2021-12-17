import express from "express"
import Usuario from '../services/usuarios.js'
const router = express.Router("router")
const usuario =new Usuario()

router.get("/:id", async (req,res)=> {    
    const product = await contenedor.getProductById(req.params.id)
    if (product.status==="success") {
        res.status(200).send(product)
    } else {
        res.status(500).send(product.message)
    }
})
