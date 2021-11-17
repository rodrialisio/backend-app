document.addEventListener("submit", e => {
    e.preventDefault()
    let form = document.getElementById("petForm")
    let data = new FormData(form)
    let name = data.get("name")
    let specie = data.get("specie")
    let age = data.get("age")
    let req = {
        name: name,
        specie: specie,
        age: age
    }
    fetch("http://localhost:8080/api/pets",{
        method: "POST",
        body: JSON.stringify(req),
        headers: {
            "Content-type":"application/json"
        }
    }).then(result => {
        return result.json()
    }).then(json=> {
        console.log(json)
    })
})