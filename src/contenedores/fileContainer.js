import fs from "fs"
import config from "../conf.js"

export default class FileContainer {
    constructor(file_endpoint) {
        this.url= `${config.fileSystem.baseUrl}/${file_endpoint}`
    }

    register = async (product)=> {
        try {   
            const data = await fs.promises.readFile(this.url,"utf-8")
            const products = JSON.parse(data)
            const search = products.some(item => item.title == product.title)
            if (search) {
                return {status:"error", message:"Producto ya existente"}
            } else {
                let timestamp = Date.now()
                let time = new Date(timestamp)
                const dataObj = {
                    id: products? products[products.length-1].id +1 : 1,
                    title : product.title,
                    timestamp: time.toString(),
                    description: product.description? product.description : "Un excelente producto.",
                    code: product.code? product.code : "XXXX",
                    price: product.price,
                    thumbnail: product.thumbnail,
                    stock: product.stock? product.stock : 2000
                }
                products.push(dataObj)
                try { 
                    await fs.promises.writeFile(this.url,JSON.stringify(products,null,2))
                    return {status:"success", message:"Producto agregado!", payload:dataObj}
                } catch (err){
                    return {status:"error",message:"No se pudo crear el producto:"+err}
                }
            }               
        } catch {
            let timestamp = Date.now()
            let time = new Date(timestamp)
            const dataObj = {
                id: 1,
                title : product.title,
                timestamp: time.toString(),
                description: product.description? product.description : "Un excelente producto.",
                code: product.code? product.code : "XXXX",
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock? product.stock : 2000
            }
            try {
                await fs.promises.writeFile(this.url,JSON.stringify([dataObj],null,2))
                return {status:"success",message:"Producto agregado!", payload: dataObj}
            }catch (err) {
                return {status:"error",message:"No se pudo crear el Producto:"+err}
            }
        }
    }

    create = async ()=> {
        try {
            const data = await fs.promises.readFile(this.url,"utf-8")
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
                    await fs.promises.writeFile(this.url,JSON.stringify(carts,null,2))
                    return {status:"success", message:"Carrito creado!", payload:dataObj}
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
                await fs.promises.writeFile(this.url,JSON.stringify([dataObj],null,2))
                return {status:"success",message:"Carrito creado!", payload: dataObj}
            }catch (err) {
                return {status:"error",message:"No se pudo crear el carrito: "+err}
            }
        }
    }

    getAll = async ()=> {
        try {
            let data = await fs.promises.readFile(this.url,"utf-8")
            return {status:"success", payload: JSON.parse(data)}
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    getById = async (id)=> {
        try {
            let data = await fs.promises.readFile(this.url,"utf-8")
            let objects = JSON.parse(data)
            let search = objects.find(item => item.id==id)
            if (search) {
                return {status:"success", message: "id encontrado", payload: search}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    getContentById= async (id)=> {
        try {
            let data = await fs.promises.readFile(this.url,"utf-8")
            let carts = JSON.parse(data)
            const search = carts.find(cart => cart.id == id)
            if (search) {
                if(search.products.length>0) {
                    return {status:"success", message:`Se encontraron los productos del carrito ${id}`, payload: search.products}
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

    updateById = async (id,body)=> {
        try{     
            let data = await fs.promises.readFile('./files/products.txt','utf-8');
            let products = JSON.parse(data);
            let search = products.some(p=>p.id==id)
            if(!search) {
                return {status:"error", message:"No hay productos con el id especificado"}
            } else {
                Object.assign(products.find(p=> p.id ==id), body)
            }
            try{    
                await fs.promises.writeFile(this.url,JSON.stringify(products,null,2));
                return {status:"success", message:"Producto actualizado", payload: (products.find(p=> p.id ===id))}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(error){
            console.log(error)
            return {status:"error",message:"Error al actualizar el producto: "+error}
        }
    }

    deleteById = async (id)=> {
        try {
            let data = await fs.promises.readFile(this.url,"utf-8")
            let objects = JSON.parse(data)
            let search = objects.find(item => item.id==id)
            if (search) {
                objects = objects.filter(item=> item.id != id)
                await fs.promises.writeFile(this.url, JSON.stringify(objects,null,2))
                return {status:"success", message: `item ${id} eliminado`}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch(err) {
            return {status:"error", message: err}
        }
    }
}