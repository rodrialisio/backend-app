import Schema from "mongoose";
import MongoContainer from "../../contenedores/mongoContainer.js";

export default class CartMongo extends MongoContainer {
    constructor() {
        super(
            "carritos",
            {   
                id: {type:Number, required: true, unique:true},
                user: {type:String, required: true, unique:true},
                products: {
                    type:[{
                        type: Schema.Types.ObjectId,
                        ref: "productos"
                    }],
                    default: null
                }
            },
            {timestamps:true}
        )
    }

    addContentById = async (cid,pid)=> {
        try {
            let search = await this.collection.find({_id:cid})
            if (search.length>0) {
                let result = await this.collection.updateOne({_id:cid},{$push:{products:pid}})
                let cartLoaded = await this.collection.find({_id:cid})
                return {status:"success", message:"producto agregado", payload:cartLoaded}
            } else {
                return {status:"error", message:"no se encontró el carrito"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error",message:err}
        }
    }

    removeContentById = async (cid,pid)=> {
        try {
            let search = await this.collection.find({_id:cid})
            if (search.length>0) {
                let result = await this.collection.updateOne({_id:cid},{$pull:{products:pid}})
                let cartLoaded = await this.collection.find({_id:cid})
                return {status:"success", message:"producto removido", payload:cartLoaded}
            } else {
                return {status:"error", message:"no se encontró el carrito"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error",message:err}
        }
    }
}