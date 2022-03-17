import express from "express"
import {logger} from "../config.js"

const router = express.Router("failed-register")

router.get("/",(req,res)=> {
    logger.info(`Método: ${req.method} Ruta: failed-register${req.url}`)
    res.send({status:"error"})
})

export default router