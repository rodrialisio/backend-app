import __dirname from "../utils.js"
import {productDatabase} from "../config.js";

class Contenedor {
    constructor() {
        productDatabase.schema.hasTable("productos").then(result=> {
            if (!result) {
                productDatabase.schema.createTable("productos", table => {
                    table.increments()
                    table.string("title").notNullable()
                    table.string("timestamp").notNullable()
                    table.string("description").notNullable()
                    table.string("code").notNullable()
                    table.integer("price").notNullable()
                    table.string("thumbnail").notNullable()
                    table.integer("stock").notNullable()
                }).then(result=> {
                    console.log("tabla de productos creada")
                })
            }
        })
    }

    registerProduct = async (product) => {
        try {
            let exists = await productDatabase.select().table("products").where("title",product.title).first()
            if (exists) {
                return {status:"error", message:"el producto ya existe"}
            } else {
                let timestamp = Date.now()
                let time = new Date(timestamp)
                product.timestamp= time.toString()
                let result = await productDatabase.table("products").insert(product)
                return {status:"success", message: "producto registrado", payload: result}
            }
        } catch(err) {
            return {status:"error", message: err}
        }
    }

    getAllProducts= async()=> {
        try {
            let products = await productDatabase.select().table("products")
            return {status:"success", message:"productos encontrados", payload:products}
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    getProductById= async (id)=> {
        try {
            let product = await productDatabase.select().table("products").where("id",id).first()
            if (product) {
                return {status:"success", message:"producto encontrado", payload:product}
            } else {
                return {status:"error", message:"no se encontró el producto"}
            }
        } catch (err) {
            return {status:"error", message:err}
        }
    }

    async updateProduct(id,body){
        try{
            let exists = await productDatabase.select().table("products").where("id",id).first()
            if (exists) {
                let timestamp = Date.now()
                let time = new Date(timestamp)
                body.timestamp= time.toString()
                const updated = await productDatabase("products").update(body).where("id",id)
                    return {status:"success", message:"producto actualizado", payload:updated}
            } else {
                return {status:"error", message:"No hay productos con el id especificado"}
            }
        }catch(err){
            return {status:"error",message:err}
        }
    }

    async deleteProductById(id) {
        try {  
            let products = await productDatabase.select().table("products")
            if (products.find((p)=> p.id === id)) {
                await productDatabase.del().table("products").where("id",id)
                return {status:"success", message: `Producto N° ${id} eliminado`}
            } else {
                return {status:"error", message:"No se encontró el producto"}
            }
        } catch (err) {
            return {status:"error",message:"No se encontró el productos"+err}
        }
    }
}

export default Contenedor