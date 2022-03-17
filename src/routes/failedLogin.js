import express from "express"
import {logger} from "../config.js"

const router = express.Router("logout")

router.get("/",(req,res)=> {
    logger.info(`Método: ${req.method} Ruta: failed-login${req.url}`)
    res.send({status:"error"})
})

export default router