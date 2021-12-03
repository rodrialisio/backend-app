const socket = io()

let user = document.getElementById("user")
let email = document.getElementById("email")
let input = document.getElementById("message-input")
let inputButton = document.getElementById("message-send-button")

function sendMessage(text) {
    if (user.value && email.value.includes("@")) {
        socket.emit("message", {email:email.value, message:input.value})
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
    let messages = data.map(message => {
        return `<div class="chat-log-message">
                    <span class="chat-log-message-user">${message.email} - </span>
                    <span class="chat-log-message-time">${message.time}: </span>
                    <span class="chat-log-message-text">${message.message}</span>
                </div>`
    }).join("")
    p.innerHTML= messages
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
    fetch("templates/productTable.handlebars")
    e.preventDefault()
    let form = document.getElementById("productForm")
    let data = new FormData(form)    
    fetch("/api/productos",{
        method: "POST",
        body: data,
    }).then(result => { 
        return result.json()
    }).then (json=> {
        console.log("productos",json)
        alert(json.message)
    })
})