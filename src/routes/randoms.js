import express from "express"
import {fork} from "child_process"

const router = express.Router("router")

router.get("/", (req,res)=> {
    const cantidad= req.query.cant
    const childProcess = fork("./routes/randomsCalculus.js",[cantidad])
    childProcess.send({"cantidad":req.query.cant})
    childProcess.on("message", data => {
        res.send(data)
    })
})

export default router