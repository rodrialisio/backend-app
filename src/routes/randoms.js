import express from "express"
import {fork} from "child_process"
import {logger} from "../config.js"

const router = express.Router("router")

router.get("/", (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: /api/randoms${req.url}`)
    /* const cantidad= req.query.cant
    const childProcess = fork("./routes/randomsCalculus.js",[cantidad])
    console.log("iniciando cálculo")
    childProcess.on("message", data => {
        res.render("randoms",{pid: process.pid, lista: JSON.stringify(data)})
    }) */
    res.render("randoms",{pid:process.pid, lista: "Cálculo desactivado"})
})

export default router