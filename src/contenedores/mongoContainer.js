import mongoose from "mongoose"
import config from "../conf.js"
mongoose.connect(config.mongo.baseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

export default class MongoContainer {
    constructor(collection,schema,timestamps){
        this.collection= mongoose.model(collection, mongoose.Schema(schema,timestamps))
    }

    register = async (product)=> {
        try {
            let products = await this.collection.find()
            if (products.length>0){
                product.id = products[products.length-1].id+1
            } else {
                product.id = 1
            }
            if (products.find(item=> item.title == product.title)) {
                return {status:"error", message: "el producto ya existe"}
            } else {
                let result = await this.collection.create(product)
                return {status:"success", message: "producto registrado", payload: result}
            }
        } catch(err) {
            return {status:"error", message: err}
        }
    }

    create= async ()=> {
        try {
            let cart ={}
            let carts = await this.collection.find()
            if (carts.length>0){
                cart.id = carts[carts.length-1].id+1
            } else {
                cart.id = 1
            }
            let result = await this.collection.create(cart)
            return {status:"success", message: "carrito creado", payload: result }           
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }

    getAll = async ()=> {
        try {
            let data = await this.collection.find()
            return {status:"success", payload: data}
        } catch(err) {
            return {status:"error", message: err}
        }
    }

    getById = async (id)=> {
        try {
            let search = await this.collection.find({_id:id})//.populate("products")
            if (search.length>0) {
                return {status:"success", message: "id encontrado", payload: search}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }

    getContentById= async (id)=> {
        try {
            let search = await this.collection.find({_id:id})
            if (search.length>0) {
                return {status:"success", payload: search[0].products}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    updateById= async (id,body)=> {
        try{
            let search = await this.collection.find({_id:id})
            if (search.length>0) {
                const updated = await this.collection.updateOne(
                    {_id:id},
                    {$set:body})
                let result = await this.collection.find({_id:id})    
                return {status:"success", message:"producto actualizado", payload:result}
            } else {
                return {status:"error", message:"no se encontró el id"}
            }
        }catch(err){
            return {status:"error",message:err}
        }
    }
    
    deleteById= async (id)=> {
        try {  
            let search = await this.collection.find({_id:id})
            if (search.length>0) {
                await this.collection.deleteOne({_id:id})        
                return {status:"success", message: `item ${id} eliminado`}
            } else {
                return {status:"error", message:"no se encontró el id"}
            }
        } catch (err) {
            return {status:"error",message:err}
        }
    }
}