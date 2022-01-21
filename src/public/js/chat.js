const socket = io()

let user
fetch("/current-user").then(async (result)=> {
    try {
        let user = await result.json()
        console.log("user: ",user)
        if (!user) {
            location.replace("/")
        }
        let saludo = document.getElementById("saludo")
        saludo.innerHTML=`Bienvenido ${user.userName}`
    } catch (err) {
        location.replace("/")
    }
})

let userId = document.getElementById("user-id")
let userName = document.getElementById("user-name")
let userLastName = document.getElementById("user-last-name")
let userAge = document.getElementById("user-age")
let userAlias = document.getElementById("user-alias")
let userAvatar = document.getElementById("user-avatar")
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