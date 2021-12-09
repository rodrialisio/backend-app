function loadProducts() {
    fetch("/api/productos",{
        method: "GET",
    }).then(result => {
        return result.json()
    }).then (json=> {
        let productList= document.getElementById("home-product-list")
        productList.innerHTML = json.payload.map(p => {
            return `<div class="card" style="width: 18rem;">
                        <img src="${p.thumbnail}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title"> ${p.title} / id: ${p.id} </h5>
                            <p class="card-text">Descripción: ${p.description}</p>
                            <p class="card-text">Código:${p.code}</p>
                            <p class="card-text">Stock:${p.stock}</p>
                        </div>
                    </div>`
        })            
    })
}
loadProducts()

function loadCarts() {
    fetch("/api/carritos",{
        method: "GET",
    }).then(result => {
        return result.json()
    }).then (json=> {
        let cartList= document.getElementById("home-cart-list")
        cartList.innerHTML = json.payload.map(c => {
            return `<div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title"> id: ${c.id} </h5>
                            <p class="card-text">Productos: ${c.products.map(c=> c.title).join(", ")}</p>
                        </div>
                    </div>`
        })            
    })
}
loadCarts()

document.addEventListener("submit", e => {
    e.preventDefault()
    let form = document.getElementById("productForm")
    let data = new FormData(form)    
    fetch("/api/productos",{
        method: "POST",
        body: data,
    }).then(result => { 
        return result.json()
    }).then (json=> {
        alert(`${json.message}, resultados en consola`)
        console.log("Prodcuto agregado:",json.payload)
    })
})

let targetProduct= document.getElementById("target-product")
let targetCart= document.getElementById("target-cart")

const getProductButton = document.getElementById("get-product-button")
getProductButton.addEventListener("click", (e)=> {
    if (targetProduct.value) {
        fetch(`/api/productos/${targetProduct.value} `,{
            method: "GET",
        }).then(result => {
            return result.json()
        }).then (json=> {
            alert(`${json.message} , resultados en consola`)
            console.log("Producto solicitado:",json.payload)           
        })
    }
})

const deleteProductButton = document.getElementById("delete-product-button")
deleteProductButton.addEventListener("click", (e)=> {
    if (targetProduct.value) {
        fetch(`/api/productos/${targetProduct.value} `,{
            method: "DELETE",
        }).then(result => {
            return result.json()
        }).then (json=> {
            alert(json.message)           
        })
    }  
})

const updateProductButton = document.getElementById("update-product-button")
updateProductButton.addEventListener("click", (e)=> {
    if(targetProduct.value) {
        e.preventDefault()
        let form = document.getElementById("productForm")
        let data = new FormData(form)    
        fetch(`/api/productos/${targetProduct.value} `,{
            method: "PUT",
            body: data,
        }).then(result => { 
            return result.json()
        }).then (json=> {
            console.log(json.payload)
            alert(`${json.message}, resultados en consola`)
        })
    }
})

const createCartButton = document.getElementById("create-cart-button")
createCartButton.addEventListener("click", (e)=> {  
    fetch(`/api/carritos`,{
        method: "POST",
    }).then(result => { 
        return result.json()
    }).then (json=> {
        console.log("Id de carrito creado: ",json.payload.id, " / lista de carritos: ", json.cartNumbers)
        alert(`${json.message}, resultados en consola`)
    })
})

const deleteCartButton= document.getElementById("delete-cart-button")
deleteCartButton.addEventListener("click",(e)=> {
    if(targetCart.value) {
        fetch(`/api/carritos/${targetCart.value} `,{
            method: "DELETE",
        }).then(result => { 
            return result.json()
        }).then (json=> {
            alert(`${json.message}, resultados en consola`)
            console.log(`Carritos restantes: ${json.cartNumbers}`)
        })
    }
})

const getCartProductsButton= document.getElementById("get-cart-products-button")
getCartProductsButton.addEventListener("click",(e)=> {
    if (targetCart.value) {
        fetch(`/api/carritos/${targetCart.value}/productos `,{
            method: "GET",
        }).then(result => { 
            return result.json()
        }).then (json=> {
            alert(`${json.message}, resultados en consola`)
            console.log(json.payload)
        })
    }    
})

const addProductButton= document.getElementById("add-product-button")
addProductButton.addEventListener("click",(e)=> {
    if (targetProduct.value && targetCart.value) {
        fetch(`/api/carritos/${targetCart.value}/productos/${targetProduct.value} `,{
            method: "POST",
        }).then(result => { 
            return result.json()
        }).then (json=> {
            alert(`${json.message}, resultados en consola`)
            console.log(json.payload)
        })
    }
})

const deleteCartProductButton= document.getElementById("delete-cart-product-button")
deleteCartProductButton.addEventListener("click",(e)=> {
    if (targetProduct.value && targetCart.value) {
        fetch(`/api/carritos/${targetCart.value}/productos/${targetProduct.value} `,{
            method: "DELETE",
        }).then(result => { 
            return result.json()
        }).then (json=> {
            alert(`${json.message}, resultados en consola`)
            console.log("Productos remanentes en carrito:",json.payload)
        })
    }
})






