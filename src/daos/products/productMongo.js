import MongoContainer from "../../contenedores/mongoContainer.js";

export default class ProductMongo extends MongoContainer {
    constructor() {
        super(
            "productos",
            {
                id: {type:Number, required: true},
                title: {type:String, required: true, unique:true},
                description: {type:String, required: true},
                code: {type:String, required: true},
                price: {type:Number, required: true},
                thumbnail: {type:String, required: true},
                stock: {type:Number, required: true}
            },
            {timestamps:true}
        )
    }
}