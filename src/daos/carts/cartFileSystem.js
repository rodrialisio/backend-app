import FileContainer from "../../contenedores/fileContainer.js";
import fs from "fs"

export default class CartFileSystem extends FileContainer {
    constructor() {
        super("carts.txt")
    }

    addContentById= async(id,id_prod)=> {
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
                        cart.products.push(product.id)
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

    removeContentById= async (id,id_prod)=> {
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
                        cart.products = cart.products.filter(p=> p != id_prod)
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