let registerForm = document.getElementById("registerForm")
let loginForm = document.getElementById("loginForm")

registerForm.addEventListener("submit",(e)=> {
    e.preventDefault()
    if(document.getElementById("register-user-password").value === document.getElementById("register-user-repeat-password").value) {
        let data = new FormData(registerForm)   
        fetch("/register-user",{
            method: "POST",
            body: data
        }).then(result => { 
            return result.json()
        }).then (json=> {    
            if (json.status==="success") {
                alert(json.message)
                registerForm.reset()
            } else {
                location.replace("./pages/signupError.html")
            }
        })
    } else {
        alert("Las contraseñas no coinciden")
    }
})

loginForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    let info = new FormData(loginForm)
    let sendObject= {
        username: info.get("login-user-id"),
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
        if (json.status==="error") {
            location.replace("./pages/loginError.html")
        }
        else location.replace("./pages/chat.html")
    })
})





