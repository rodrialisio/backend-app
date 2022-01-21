const socket = io()

let registerForm = document.getElementById("registerForm")
let loginForm = document.getElementById("loginForm")

let productForm= document.getElementById("productForm")

registerForm.addEventListener("submit",(e)=> {
    e.preventDefault()
    if(document.getElementById("register-user-password").value === document.getElementById("register-user-repeat-password").value) {
        let info = new FormData(registerForm)
        let sendObject= {
            id: info.get("register-user-id"),
            name: info.get("register-user-name"),
            last_name: info.get("register-user-last-name"),
            age: info.get("register-user-age"),
            alias: info.get("register-user-alias"),
            avatar: info.get("register-user-avatar"),
            password: info.get("register-user-password")
        }
        fetch("/register-user", {
            method:"POST",
            body: JSON.stringify(sendObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(result => { 
            return result.json()
        }).then (json=> {
            console.log("respuesta",json)
            alert(json.message)
            if (json.status==="success") registerForm.reset()
        })
    } else {
        alert("Las contraseñas no coinciden")
    }
})

loginForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    let info = new FormData(loginForm)
    let sendObject= {
        id: info.get("login-user-id"),
        password: info.get("login-user-password")
    }
    fetch("/login-user", {
        method:"POST",
        body: JSON.stringify(sendObject),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(result => { 
        return result.json()
    }).then (json=> {
        if (json.status==="error") alert(json.message)
        else location.replace("./pages/chat.html")
    })
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
})





