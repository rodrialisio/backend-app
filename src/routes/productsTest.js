import express from "express"
import faker from "faker"

const router = express.Router("router")

router.get("/", (req,res)=> {
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
    res.render("ProductsTest",{lista:products})
})

export default router