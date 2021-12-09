import express from "express"
import Carrito from '../classes/carrito.js'
const router = express.Router("router")
const carrito =new Carrito()

router.get("/", (req,res)=> {
    carrito.getAllCarts().then(result=> {
        res.send(result)
    })
})

router.get("/:id/productos", (req,res)=> {
    const id= req.params.id
    carrito.getCartProducts(id).then(result=> {
        res.send(result)
    })
})

router.post("/",(req,res)=> {                                               
    carrito.createCart().then(result=>{
        res.send(result);
    })
})

router.post("/:id/productos/:id_prod",(req,res)=> {  
    const id= req.params.id
    const id_prod= req.params.id_prod
    carrito.addProduct(id,id_prod).then(result=>{
        res.send(result);
    })
})

router.delete("/:id",(req,res)=> {                                               
    const id = req.params.id
    carrito.deleteCartById(id).then(result=>{
        res.send(result);
    })
})

router.delete("/:id/productos/:id_prod",(req,res)=> {  
    const id= req.params.id
    const id_prod= req.params.id_prod
    carrito.deleteProduct(id,id_prod).then(result=>{
        res.send(result);
    })
})

export default router