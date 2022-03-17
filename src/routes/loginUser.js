import express from "express"
import {logger} from "../config.js"
import passport from "passport"

const router = express.Router("logout")

router.post("/", passport.authenticate("login",{failureRedirect:"/failed-login"}),async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: login-user${req.url}`)
    req.session.user = {
        userId: req.user.id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        userPhone: req.user.phone
    }
    res.send({status:"success", message: "usuario logueado exitosamente"})
})

export default router