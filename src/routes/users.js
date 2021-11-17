const express = require("express")
const router = express.Router("router")
const Contenedor = require('../classes/contenedor.js')
const contenedor =new Contenedor()
const upload = require("../services/upload")

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

module.exports = router