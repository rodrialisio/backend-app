import mongoose from "mongoose"
import config from "../../conf.js"
import {logger} from "../../config.js"

mongoose.connect(config.mongo.baseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

export const users = mongoose.model("usuarios", mongoose.Schema({
    id: {type:String,required:true},
    name: {type:String,required:true},
    last_name: {type:String,required:true},
    age: {type:Number,required:true},
    alias: {type:String,required:true},
    avatar: {type:String,required:true},
    password: {type:String,required:true}
},{
    timestamps: true
}))

export default class UserMongo {
    constructor() {
        this.collection = users
    }

    registerUser = async (userData)=> {
        try {
            let users = await this.collection.find()
            if (users.find(user=> user.id == userData.id)) {
                logger.error("el usuario ya existe")
                return {status:"error", message: "el usuario ya existe"}
            } else {
                let result = await this.collection.create(userData)
                return {status:"success", message: "usuario registrado", payload: result}
            }
        } catch(err) {
            logger.error(err)
            return {status:"error", message: err}
        }
    }

    getUserById = async (id)=> {
        try {
            let search = await this.collection.find({id:id})
            if (search.length>0) {
                return {status:"success", message: "usuario encontrado", payload: search}
            } else {
                logger.error("usuario o contraseña incorrecta")
                return {status:"error", message: "usuario o contraseña incorrecta"}
            }
        } catch (err) {
            logger.error(err)
            return {status:"error", message: err}
        }
    }
}



