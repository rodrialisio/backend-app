import express from "express"
import Contenedor from '../classes/contenedor.js'
import upload from "../services/upload.js"

const router = express.Router("router")
const contenedor =new Contenedor()

router.get("/",async (req,res)=> {             
    const users = await contenedor.getAllUsers()
    if (users.status==="success") {
            res.status(200).send(users.payload)
    } else {
        res.status(500).send(users.message)
    }
}) 

router.get("/:nombre", async (req,res)=> {    
    const users = await contenedor.getAllUsers()
    if (users.status==="success") {
        res.status(200).send(users.payload.find(item=> item.nombre===req.params.nombre))
    } else {
        res.status(500).send(users.message)
    }
}) 

export default router