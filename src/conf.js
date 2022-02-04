import __dirname from "./utils.js";
import dotenv from "dotenv"

dotenv.config()

export default {
    fileSystem: {
        baseUrl: __dirname+"/files"
    },
    mongo: {
        baseUrl: process.env.MONGO_URL_ECOMMERCE
    },
    firebase: {
        databaseUrl: "https://ecommerce-bb234.firebaseio.com"
    } 
}