import express from "express"
import {logger} from "../config.js"
import compression from "compression"
import { minimizedArgs } from "../app.js"
import cluster from "cluster"

const router = express.Router("info")

router.get("/", compression(), (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: info${req.url}`)
    const info= {
        entry_arg: minimizedArgs._.slice(2),
        platform: process.platform,
        node_version: process.version,
        reserved_memory: process.memoryUsage(),
        execution_path: process.execPath,
        process_id: process.pid,
        proyect_folder: process.cwd(),
        cpus: cluster.isMaster? 1: core.cpus().length
    }
    res.render("info",info)
})

export default router