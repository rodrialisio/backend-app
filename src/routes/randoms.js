import express from "express"
import {fork} from "child_process"

const router = express.Router("router")

router.get("/", (req,res)=> {
    const cantidad= req.query.cant
    const childProcess = fork("./routes/randomsCalculus.js",[cantidad])
    childProcess.on("message", data => {
        res.render("randoms",{pid: process.pid, lista: JSON.stringify(data)})
    })
})

export default router