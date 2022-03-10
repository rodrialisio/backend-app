const socket = io()

let cartId
fetch("/current-user").then(async (result)=> {
    try {
        let user = await result.json()
        if (!user) {
            location.replace("/")
        }
        let saludo = document.getElementById("saludo")
        saludo.innerHTML=`Bienvenido ${user.userName}`
        document.getElementById("user-picture").src = user.userAvatar
        let userId= document.getElementById("user-id")
        userId.innerHTML= user.userId
        fetch(`/api/carritos/usuario?username=${user.userId}`).then(result=> {
            return result.json()
        }).then(json=> {    
            if(json.status!=="success") {
                fetch(`/api/carritos?username=${user.userId}`, {
                    method: "POST"
                }).then(result=> {
                    return result.json()
                }).then(json=> {
                    cartId = json.payload._id
                    alert(`Carrito de ${user.userName} creado:`,json.payload._id)
                })
            } else {
                cartId = json.payload[0]._id
                console.log("el usuario ya posee carrito: ", json.payload[0]._id)
            }
        })
    } catch (err) {
        location.replace("/")
    }
})

let input = document.getElementById("message-input")
let inputButton = document.getElementById("message-send-button")
let logOutButton = document.getElementById("log-out-button")

let messageCompression= document.getElementById("compresion")

logOutButton.addEventListener("click", ()=> {
    fetch("/logout").then(result => result.json()).then(json=> {
        console.log(json)
    })
})

function sendMessage(text) {
    socket.emit("message",{message: input.value})    
    input.value=""
}

input.addEventListener("keyup",(e)=> {
    if (e.key==="Enter" && input.value !="") {sendMessage()}
})

inputButton.addEventListener("click", ()=> {
    if (input.value !="") {sendMessage()}
})

socket.on("messagelog",data => {
    let p = document.getElementById("home-chat-message-log")

    const authorSchema= new normalizr.schema.Entity("autores")
    const messageSchema= new normalizr.schema.Entity("mensajes",{
        author: authorSchema
    })
    const chatSchema= new normalizr.schema.Entity("chatLogs",{
        mensajes: [messageSchema]
    })
    const denormalizedData = normalizr.denormalize(data.payload.result,chatSchema,data.payload.entities)

    let normalizada= JSON.stringify(data.payload).length
    let desnormalizada = denormalizedData? JSON.stringify(denormalizedData).length : 2
    const compresion= Math.floor(normalizada/desnormalizada*100)+"%"
    console.log(`normalizada:${normalizada} desnormalizada:${desnormalizada} compresión al ${compresion}`)
    messageCompression.innerHTML= `(compresión al ${compresion})`
    
    if (denormalizedData) {
        let messages = denormalizedData.mensajes.map(message => {
            return `<div class="chat-log-message">
                        <span class="chat-log-message-user">${message.author.id} - </span>
                        <span class="chat-log-message-time">${message.time}: </span>
                        <span class="chat-log-message-text">${message.text}</span>
                    </div>`
        }).join("")
        p.innerHTML= messages
    } else {
        p.innerHTML= "No hay mensajes"
    }
}) 

let clearLogButton = document.getElementById("clear-log-button")
clearLogButton.addEventListener("click", ()=> {
    socket.emit("clearLog")
})

let productForm= document.getElementById("productForm")

socket.on("updateProducts", data => {
    const productList = document.getElementById("home-product-list")
    let productCards = data.payload.map(product => {
        return  `<div>
                    <p>id:${product.id}</p>
                    <h5>${product.title}</h5>
                    <img src=${product.thumbnail} alt="picture">
                    <h5>$${product.price}</h5>
                    <div>${product.description}</div>
                    <div>Codigo: ${product.code}</div>
                    <div>Stock: ${product.stock}</div>
                    <button onclick="addToCart(\'${product._id}\')" class="btn btn-secondary add-button">Agregar</button>
                </div>`
    }).join("")
    productList.innerHTML= productCards
})

const addToCart = (productId) => {
    fetch(`/api/carritos/${cartId}/productos/${productId}`, {
        method: "POST"
    }).then(result=> {
        return result.json()
    }).then(json=> {
        alert(json.message)
    })
}


productForm.addEventListener("submit", e => {
    e.preventDefault()
    let data = new FormData(productForm)   
    fetch("/api/productos",{
        method: "POST",
        body: data,
    }).then(result => { 
        return result.json()
    }).then (json=> {
        console.log("respuesta",json)
        alert(json.message)
    })
    productForm.reset()
})