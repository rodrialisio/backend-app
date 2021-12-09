import fs from "fs"

export default class Carrito {
    async createCart() {
        try {
            const data = await fs.promises.readFile("./files/carts.txt","utf-8")
            const carts = JSON.parse(data)
            let timestamp = Date.now()
            let time = new Date(timestamp)
            const dataObj = {
                id: carts? carts[carts.length-1].id +1 : 1,
                timestamp: time.toString(),
                products: []
            }
            carts.push(dataObj)
                try {
                    await fs.promises.writeFile("./files/carts.txt",JSON.stringify(carts,null,2))
                    return {status:"success", message:"Carrito agregado!", payload:dataObj, cartNumbers: carts.map(c=> c.id)}
                } catch (err){
                    return {status:"error",message:"No se pudo crear el carrito: "+err}
                }             
        } catch {
            let timestamp = Date.now()
            let time = new Date(timestamp)
            const dataObj = {
                id: 1,
                timestamp: time.toString(),
                products: []
            }
            try {
                await fs.promises.writeFile("./files/carts.txt",JSON.stringify([dataObj],null,2))
                return {status:"success",message:"Carrito agregado!", payload: dataObj}
            }catch (err) {
                return {status:"error",message:"No se pudo crear el carrito: "+err}
            }
        }
    }

    async getCartProducts(id) {
        try {
            let data = await fs.promises.readFile("./files/carts.txt","utf-8")
            let carts = JSON.parse(data)
            const cart = carts.find(cart => cart.id == id)
            if (cart) {
                if(cart.products.length>0) {
                    return {status:"success", message:"Se encontraron los productos del carrito", payload: cart.products}
                } else {
                    return {status:"error", message:"El carrito no tiene productos"}
                }
            } else {
                return {status:"error", message:"No se encontró el carrito"}
            }
        } catch (err) {
            return {status:"error", message: "No se pudo encontrar el carrito: "+err}
        }
    }

    async addProduct(id,id_prod) {
        try {
            let cartsData = await fs.promises.readFile("./files/carts.txt","utf-8")
            let carts = JSON.parse(cartsData)
            const cart = carts.find(cart => cart.id == id)
            if (cart) {
                try {
                    let productsData = await fs.promises.readFile("./files/products.txt","utf-8")
                    let products = JSON.parse(productsData)
                    const product = products.find(product => product.id == id_prod)
                    if (product) {
                        cart.products.push(product)
                        try {
                            await fs.promises.writeFile("./files/carts.txt", JSON.stringify(carts,null,2))
                            return {status:"success",message:`Producto ${id_prod} agregado al carrito ${id} !`, payload: cart.products}
                        } catch {
                            return {status:"error",message:"No se pudo agregar el producto al carrito: "+err}
                        }
                    } else { 
                        return {status: "error" , message: "No se encontró el producto"}
                    }
                } catch { 
                    return {status:"error",message:"No se encontró el producto: "+err}
                }
            } else { 
                return {status: "error" , message: "No se encontró el carrito"}
            }
        } catch (err) {
            return {status:"error",message:"No se encontró el producto: "+err}
        }
    }

    async deleteCartById(id) {
        try {
            let data = await fs.promises.readFile("./files/carts.txt","utf-8")
            let carts = JSON.parse(data)
            if (carts.find((c)=> c.id == id)) {
                carts = carts.filter(c => c.id != id)
                await fs.promises.writeFile("./files/carts.txt",JSON.stringify(carts,null,2))
                return {status:"success", message: `Carrito N° ${id} eliminado`, cartNumbers: carts.map(c=> c.id)}
            } else {
                return {status:"error", message:"No se encontró el carrito"}
            }
        } catch (err) {
            return {status:"error",message:"No se encontró el carrito: "+err}
        }
    }

    async deleteProduct(id,id_prod) {
        try {
            let cartsData = await fs.promises.readFile("./files/carts.txt","utf-8")
            let carts = JSON.parse(cartsData)
            const cart = carts.find(cart => cart.id == id)
            if (cart) {
                try {
                    let productsData = await fs.promises.readFile("./files/products.txt","utf-8")
                    let products = JSON.parse(productsData)
                    const product = products.find(product => product.id == id_prod)
                    if (product) {
                        cart.products = cart.products.filter(p=> p.id != id_prod)
                        try {
                            await fs.promises.writeFile("./files/carts.txt", JSON.stringify(carts,null,2))
                            return {status:"success",message:`Producto ${id_prod} eliminado del carrito ${id} !`, payload: cart.products}
                        } catch {
                            return {status:"error",message:"No se pudo eliminar el producto al carrito: "+err}
                        }
                    } else { 
                        return {status: "error" , message: "No se encontró el producto"}
                    }
                } catch { 
                    return {status:"error",message:"No se pudo encontrar el producto: "+err}
                }
            } else { 
                return {status: "error" , message: "No se encontró el carrito"}
            }
        } catch (err) {
            return {status:"error",message:"No se pudo encontrar el producto: "+err}
        }
    }
}