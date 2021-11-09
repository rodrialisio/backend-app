const fs = require("fs")

class Contenedor {
    async save(product) {
        try {
            const data = await fs.promises.readFile("./files/products.txt","utf-8")
            const products = JSON.parse(data)
            if (products.some(e => e.title === product.title)) {
                return {status:"error", message:"Producto ya existente"}
            } else {
                const dataObj = {
                    id: products? products[products.length-1].id +1 : 1,
                    title : product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                }
                products.push(dataObj)
                try {
                    fs.promises.writeFile("./files/products.txt",JSON.stringify(products,null,2))
                    return {status:"success", message:"Producto agregado! id: ", payload:dataObj.id}
                } catch (err){
                    return {status:"error",message:"No se pudo crear el producto:"+err}
                }
            }               
        } catch {
            const dataObj = {
                id: 1,
                title : product.title,
                price: product.price,
                thumbnail: product.thumbnail
            }
            try {
                await fs.promises.writeFile("./files/products.txt",JSON.stringify([dataObj],null,2))
                return {status:"success",message:"Producto creado exitosamente!", payload: dataObj.id}
            }catch (err) {
                return {status:"error",message:"No se pudo crear el Producto:"+err}
            }
        }
    }
    async getProductById(id) {
        try {
            let data = await fs.promises.readFile("./files/products.txt","utf-8")
            let products = JSON.parse(data)
            let event = products.find(e => e.id===id)
            if (event) {
                console.log(event)
                return {status:"success",message:"Producto encontrado!"}
            } else {
                return {status:"error",message:"No se encontró el Producto"}
            }
            
        } catch (err) {
            return {status:"error",message:"No se encontró el Producto:"+err}
        }
    }
    async getAllProducts() {
        try {
            let data = await fs.promises.readFile("./files/products.txt","utf-8")
            let products = JSON.parse(data)
            if (products) {
                return {status:"success",message:"Productos: ", payload: products}
            } else {
                return {status:"error",message:"No se encontraron productos"}
            }   
        } catch (err) {
            return {status:"error",message:"No se encontraron productos"+err}
        }
    }
    async getAllUsers() {
        try {
            let data = await fs.promises.readFile("./files/users.txt","utf-8")
            let users = JSON.parse(data)
            if (users) {
                return {status:"success",message:"Usuarios: ", payload: users}
            } else {
                return {status:"error",message:"No se encontraron usuarios"}
            }   
        } catch (err) {
            return {status:"error",message:"No se encontraron usuarios"+err}
        }
    }
    async deleteProductById(id) {
        try {
            let data = await fs.promises.readFile("./files/products.txt","utf-8")
            let products = JSON.parse(data)
            if (products.find((p)=> p.id === id)) {
                products = products.filter(p => p.id !== id)
                await fs.promises.writeFile("./files/products.txt",JSON.stringify(products,null,2))
                return {status:"success", message: "Producto eliminado"}
            } else {
                return {status:"error", message:"No se encontró el producto"}
            }
        } catch (err) {
            return {status:"error",message:"No se encontró el productos"+err}
        }
    }
    async deleteAllProducts() {
        try {
            await fs.promises.writeFile("./files/products.txt","[]")
            return {status:"success", message: "Productos eliminados"}
        }catch (err){
            return {status:"error",message:"No se pudo eliminar los productos. "+err}
        }
    }  
}

module.exports = Contenedor