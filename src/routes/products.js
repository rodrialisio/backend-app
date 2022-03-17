import express from "express"
import upload from "../services/upload.js"
import { io } from "../app.js"                 
import {products} from "../daos/index.js"    
import {logger} from "../config.js"

const router = express.Router("router")

router.get("/", async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: /api/productos${req.url}`)
    products.getAll().then(products=> {
        if (products.status==="success") {
            res.send({status: "success", message: "productos encontrados", payload: products.payload})
        } else {
            res.send({status: "error", message: "no se encontraron productos"})
        }
    })
})

router.get("/:id", async (req,res)=> {   
    logger.info(`Método: ${req.method} Ruta: /api/productos${req.url}`) 
    const product = await products.getById(req.params.id)
    if (product.status==="success") {
        res.status(200).send(product)
    } else {
        res.status(500).send(product)
    }
})

router.post('/', upload.single("image"), (req,res)=>{
    logger.info(`Método: ${req.method} Ruta: /api/productos${req.url}`)
    let product = req.body;
    product.price= parseInt(product.price)
    let thumbnail= req.protocol+"://"+req.hostname+":8080"+"/images/"+req.file.filename     
    product.thumbnail= thumbnail                                                     
    products.register(product).then(result=>{
        if (result.status==="success") {
            products.getAll().then(products=> {
                io.emit("updateProducts",products)
            })
        }
        res.send(result);
    })
})

router.put('/:id', upload.single("image"),(req,res)=>{
    logger.info(`Método: ${req.method} Ruta: /api/productos${req.url}`)
    let id = req.params.id
    let body = req.body
    if (req.file) {
        body.thumbnail= req.protocol+"://"+req.hostname+":8080"+"/images/"+req.file.filename 
    }
    products.updateById(id,body).then(result=>{
        if (result.status==="success") {
            products.getAll().then(products=> {
                io.emit("updateProducts",products)
            })
        } 
        res.send(result);
    })
})

router.delete('/:id', (req,res)=>{
    logger.info(`Método: ${req.method} Ruta: /api/productos${req.url}`)
    let id= req.params.id
    products.deleteById(id).then(result=>{
        res.send(result)
        if (result.status==="success") {
            products.getAll().then(result=> {
                io.emit("updateProducts",result)
            })
        }
    })
})

export default router