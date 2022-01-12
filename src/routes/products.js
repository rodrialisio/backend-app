import express from "express"
import upload from "../services/upload.js"
import { io } from "../app.js"
import { authMiddleware } from "../utils.js"                  
import {products} from "../daos/index.js"

const router = express.Router("router")

router.get("/", async (req,res)=> {
    products.getAll().then(products=> {
        if (products.status==="success") {
            res.render("Products",{lista: JSON.parse(JSON.stringify(products.payload))})
        } else {
            res.render("Products",{lista: []})
        }
    })
})

router.get("/:id", async (req,res)=> {    
    const product = await products.getById(req.params.id)
    if (product.status==="success") {
        res.status(200).send(product)
    } else {
        res.status(500).send(product)
    }
})

router.post('/',authMiddleware, upload.single("image"), (req,res)=>{
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

router.put('/:id',authMiddleware, upload.single("image"),(req,res)=>{
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

router.delete('/:id',authMiddleware, (req,res)=>{
    //let id= parseInt(req.params.id)
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