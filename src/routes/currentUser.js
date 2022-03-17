import express from "express"
import {logger} from "../config.js"

const router = express.Router("current-user")

router.get("/", (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: current-user${req.url}`)
    res.send(req.session.user)
})

export default router