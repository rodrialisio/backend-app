//Desafío clase 3:

const Contenedor = require("./classes/contenedor.js")
const contenedor = new Contenedor()

contenedor.save({
    title : "mate",
    price : 100,
    thumbnail: "https://www.infocampo.com.ar/wp-content/uploads/2021/09/Yerba-mate-infocampo.jpg"
}).then((result)=> console.log(result.message, result.payload))

/* contenedor.getById(121854).then((result) => console.log(result.message)) */

/* contenedor.getAll().then((result) => console.log(result.message, result.log)) */

/* contenedor.deleteById(2).then((result) => console.log(result.message)) */

/* contenedor.deleteAll().then((result)=> console.log(result.message)) */

