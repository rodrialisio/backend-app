const socket = io()

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