import faker from "faker"

export function productTest(res) {
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
}
