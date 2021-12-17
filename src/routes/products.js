import express from "express"
import upload from "../services/upload.js"
import { io } from "../app.js"
import { authMiddleware } from "../utils.js"
//import Contenedor from '../classes/contenedor.js'                         //para usar filesystem
import Contenedor from "../services/productos.js"                           //para mysql

const router = express.Router("router")
const contenedor =new Contenedor()

router.get("/", async (req,res)=> {
    const products = await contenedor.getAllProducts()                          //para views del front
   /*  if (products.status==="success") {
        res.status(200).send(products)
    } else {
        res.status(500).send(products)
    } */
    if (products.status==="success") {
        res.status(200).render("Products",{lista: products.payload})
    } else {
        res.status(500).render("Products",{lista: []})
    }
})

router.get("/:id", async (req,res)=> {    
    const product = await contenedor.getProductById(req.params.id)
    if (product.status==="success") {
        res.status(200).send(product)
    } else {
        res.status(500).send(product.message)
    }
})

router.post('/',authMiddleware, upload.single("image"), (req,res)=>{
    let product = req.body;
    product.price= parseInt(product.price)
    let thumbnail= req.protocol+"://"+req.hostname+":8080"+"/images/"+req.file.filename     
    product.thumbnail= thumbnail                                                     
    contenedor.registerProduct(product).then(result=>{
        if (result.status==="success") {
            contenedor.getAllProducts().then(products=> {
                io.emit("updateProducts",products)
            })
        }
        res.send(result);
    })
})

router.put('/:id',authMiddleware, upload.single("image"),(req,res)=>{
    let id = parseInt(req.params.id);
    let body = req.body
    body.thumbnail= req.protocol+"://"+req.hostname+":8080"+"/images/"+req.file.filename    
    contenedor.updateProduct(id,body).then(result=>{
        if (result.status==="success") {
            contenedor.getAllProducts().then(products=> {
                io.emit("updateProducts",products)
            })
        } 
        res.send(result);
    })
})

router.delete('/:id',authMiddleware, (req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteProductById(id).then(result=>{
        res.send(result)
        if (result.status==="success") {
            contenedor.getAllProducts().then(result=> {
                io.emit("updateProducts",result)
            })
        }
    })
})

export default router