import express from "express"
import {logger} from "../config.js"
import { orderMessage } from "../utils.js"
import { phoneMessages } from "../utils.js"

const router = express.Router("logout")

router.post("/", async (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: pedido${req.url}`)
    const order = await orderMessage(req.body.products, req.body.owner)
    const phoneOrder = await phoneMessages(req.body.products, req.body.owner, req.body.ownerPhone)
    if (order.status === "success" && phoneOrder.status === "success") {
        res.send({status: "success", message: order.message +", "+ phoneOrder.message})
    } else {
        res.send({status:"error", message: order.message +", "+ phoneOrder.message})
    }
})

export default router