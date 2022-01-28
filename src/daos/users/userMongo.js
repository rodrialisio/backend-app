import mongoose from "mongoose"

mongoose.connect("mongodb+srv://rodrialisio:asd456@cluster0.a2jas.mongodb.net/ecommerce?retryWrites=true&w=majority", {
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
                return {status:"error", message: "el usuario ya existe"}
            } else {
                let result = await this.collection.create(userData)
                return {status:"success", message: "usuario registrado", payload: result}
            }
        } catch(err) {
            return {status:"error", message: err}
        }
    }

    getUserById = async (id)=> {
        try {
            let search = await this.collection.find({id:id})
            if (search.length>0) {
                return {status:"success", message: "usuario encontrado", payload: search}
            } else {
                return {status:"error", message: "usuario o contraseña incorrecta"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }
}



