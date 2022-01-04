import express from "express"
import {carts} from "../daos/index.js"

const router = express.Router("router")

router.get("/", (req,res)=> {
    carts.getAll().then(result=> {
        res.send(result)
    })
})

router.get("/:id", (req,res)=> {
    const id= req.params.id
    carts.getById(id).then(result=> {
        res.send(result)
    })
})

router.get("/:id/productos", (req,res)=> {
    const id= req.params.id
    carts.getContentById(id).then(result=> {
        res.send(result)
    })
})

router.post("/",(req,res)=> {                                               
    carts.create().then(result=>{
        res.send(result);
    })
})

router.post("/:id/productos/:id_prod",(req,res)=> {  
    const id= req.params.id
    const id_prod= req.params.id_prod
    carts.addContentById(id,id_prod).then(result=>{
        res.send(result);
    })
})

router.post("/productos",(req,res)=> {  
    const cid= req.body.cid
    const pid= req.params.pid
    carts.addContentById(cid,pid).then(result=>{
        res.send(result);
    })
})

router.delete("/:id",(req,res)=> {                                               
    const id = req.params.id
    carts.deleteById(id).then(result=>{
        res.send(result);
    })
})

router.delete("/:id/productos/:id_prod",(req,res)=> {  
    const id= req.params.id
    const id_prod= req.params.id_prod
    carts.removeContentById(id,id_prod).then(result=>{
        res.send(result);
    })
})

export default router