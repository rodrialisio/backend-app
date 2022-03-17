import express from "express"
import {logger} from "../config.js"
import { registerMessage } from "../utils.js"
import upload from "../services/upload.js"
import passport from "passport"

const router = express.Router("register-user")

router.post("/", upload.single("avatar"), passport.authenticate("register",{failureRedirect:"/failed-register"}), async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: register-user${req.url}`)
    const message = await registerMessage(req.user)
    res.send({status:"success", message:"usuario creado exitosamente"})
})

export default router