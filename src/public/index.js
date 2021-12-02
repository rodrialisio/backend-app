
const socket = io()

let user = document.getElementById("user")
let email = document.getElementById("email")
let input = document.getElementById("message-input")

input.addEventListener("keyup",(e)=> {
    if (e.key==="Enter") {
        if (user.value && email.value) {
            socket.emit("message", {user:user.value, message:e.target.value})
            input.value=""
        } else {
            alert("Por favor completa tus datos para chatear.")
        }        
    }
})

socket.on("messagelog",data => {
    let p = document.getElementById("home-chat-message-log")
    let messages = data.map(message => {
        return `<div><span>${message.user} : ${message.message}</span></div>`
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
        alert("Nuevo producto ingresado!")
    })
})