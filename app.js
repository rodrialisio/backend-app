const Manager = require("./classes/manager.js")
const manager = new Manager()

manager.save({
    title : "mate",
    price : 100,
    thumbnail: "https://www.infocampo.com.ar/wp-content/uploads/2021/09/Yerba-mate-infocampo.jpg"
}).then((result)=> console.log(result.message, result.log))

/* manager.getById(121854).then((result) => console.log(result.message)) */

/* manager.getAll().then((result) => console.log(result.message, result.log)) */

/* manager.deleteById(2).then((result) => console.log(result.message)) */

/* manager.deleteAll().then((result)=> console.log(result.message)) */

