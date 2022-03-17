import express from "express"
import {logger} from "../config.js"

const router = express.Router("logout")

router.get("/", (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: logout${req.url}`)
    req.session.user= null
    req.logout()
})

export default router