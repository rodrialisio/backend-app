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
        console.log(json)
        alert("Nuevo producto ingresado!")
    })
})