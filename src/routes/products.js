const express =require("express")
const router = express.Router("router")
const Contenedor = require('../classes/contenedor.js')
const contenedor =new Contenedor()
const upload = require("../services/upload")

router.get("/", async (req,res)=> {
    const products = await contenedor.getAllProducts()
    if (products.status==="success") {
            res.status(200).send(products.payload)
    } else {
        res.status(500).send(products.message)
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

router.post('/',upload.single("image"),(req,res)=>{
    let product = req.body;
    product.price= parseInt(product.price)
    let thumbnail= "http://localhost:8080/images/"+req.file.filename
    product.thumbnail= thumbnail                                                     
    contenedor.registerProduct(product).then(result=>{
        res.send(result);
    })
})

router.put('/:id',upload.single("image"),(req,res)=>{
    let id = parseInt(req.params.id);
    let body = req.body
    body.thumbnail= "http://localhost:8080/images/"+req.file.filename
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})

router.delete('/:id',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteProductById(id).then(result=>{
        res.send(result)
    })
})

module.exports = router