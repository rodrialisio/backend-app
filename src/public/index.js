const socket = io()

let userId = document.getElementById("user-id")
let userName = document.getElementById("user-name")
let userLastName = document.getElementById("user-last-name")
let userAge = document.getElementById("user-age")
let userAlias = document.getElementById("user-alias")
let userAvatar = document.getElementById("user-avatar")
let input = document.getElementById("message-input")
let inputButton = document.getElementById("message-send-button")
let messageCompression= document.getElementById("compresion")

function sendMessage(text) {
    if (userId.value.includes("@") && userName.value && userLastName.value && userAge.value && userAlias.value && userAvatar.value) {
        socket.emit("message", {
            author: {
                id: userId.value,
                nombre: userName.value,
                apellido: userLastName.value,
                edad: userAge.value,
                alias: userAlias.value,
                avatar: userAvatar.value
            },
            text: input.value
        })
        input.value=""
    } else {
        alert(`Por favor completa tus datos para chatear. Tu dirección de e-mail debe incluir "@"`)
    }    
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

    console.log(data)
    console.log(denormalizedData)

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

socket.on("updateProducts", data => {
    let products = data.payload
    fetch("templates/productTable.handlebars").then(string => string.text()).then(template => {
        const processedTemplate= Handlebars.compile(template)
        const templateObject= {
            products: products,
        }
        const html = processedTemplate(templateObject)
        const homeProductList = document.getElementById("home-product-list")
        homeProductList.innerHTML = html
    })

})

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
        console.log("respuesta",json)
        alert(json.message)
    })
})





