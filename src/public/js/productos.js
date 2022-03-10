fetch("/current-user").then(async (result)=> {
    try {
        let user = await result.json()
        console.log(user)
    } catch (err) {
        location.replace("/")
    }
})

const productCatalog = document.getElementById("product-catalog")

fetch("/api/productos").then(productos=> {
    return  productos.json()
}).then(json=> {
    const products = json.payload
    console.log = products
    productCatalog.innerHTML = products.map(product=> {
        return `<div class="card" style="width: 18rem;">
                    <p>id:${product.id}</p>
                    <h5>${product.title}</h5>
                    <img src=${product.thumbnail} class="card-img-top" alt="picture">
                    <h5>$${product.price}</h5>
                    <div>${product.description}</div>
                    <div>Codigo: ${product.code}</div>
                    <div>Stock: ${product.stock}</div>
                </div>`
                
    })
})