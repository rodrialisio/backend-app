const username = document.getElementById("username")
const productCards = document.getElementById("product-cards")

let cartId
let products
let owner
let ownerPhone
fetch("/current-user").then(async (result)=> {
    try {
        let currentUser = await result.json()
        owner = `${currentUser.userName} (${currentUser.userId})`
        ownerPhone = currentUser.userPhone
        username.innerHTML= `<h2>Carrito de ${currentUser.userName}</h2><h5>(${currentUser.userId})</h5>`
        fetch(`/api/carritos/usuario?username=${currentUser.userId}`).then(result=> {
            return result.json()
        }).then(json=> {    
            cartId= json.payload[0]._id
            products = json.payload[0].products
            if(products.length>0) {
                productCards.innerHTML = products.map(product => {
                    return  `<div>
                                <p>id:${product.id}</p>
                                <h5>${product.title}</h5>
                                <img src=${product.thumbnail} alt="picture">
                                <h5>$${product.price}</h5>
                                <div>${product.description}</div>
                                <div>Codigo: ${product.code}</div>
                                <div>Stock: ${product.stock}</div>
                                <button onclick="removeFromCart(\'${product._id}\')" class="btn btn-secondary add-button">Eliminar</button>
                            </div>`
                }).join("")
            } else {
                console.log("Carrito vacio")
            }    
        })
    } catch (err) {
        location.replace("/")
    }
})

const removeFromCart = (productId) => {
    fetch(`/api/carritos/${cartId}/productos/${productId}`, {
        method: "DELETE"
    }).then(result=> {
        return result.json()
    }).then(json=> {
        alert(json.message)
        location.reload()
    })
}

const orderButton = document.getElementById("boton-pedido")
orderButton.addEventListener("click", ()=> {
    fetch(`/pedido`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            products: products,
            owner: owner,
            ownerPhone: ownerPhone
        })
    }).then(result=> {
        return result.json()
    }).then(json=> {
        console.log(json.message)
        alert(json.message)
        location.replace("/pages/chat.html")
    })
})
