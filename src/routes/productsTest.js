import express from "express"
import faker from "faker"
import {logger} from "../config.js"

const router = express.Router("router")

router.get("/", (req,res)=> {
    logger.info(`Método: ${req.method} Ruta: /api/productos-test${req.url}`)
    let products = []
    for (let i=0; i<5; i++) {
        products.push({
            id: i+1,
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            code: faker.datatype.string(),
            price: faker.datatype.number,
            stock: faker.datatype.number(),
            thumbnail: faker.image.food()
        })
    }
    console.log(`test exitoso`)
    res.render("ProductsTest",{lista:products})
})

export default router