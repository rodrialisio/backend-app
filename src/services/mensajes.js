import {messageDatabase} from "../config.js";

export default class Mensajes {
    constructor() {
        messageDatabase.schema.hasTable("messages").then(result=> {
            if (!result) {
                database.schema.createTable("messages", table => {
                    table.increments()
                    table.string("email").notNullable()
                    table.string("time").notNullable()
                    table.string("message").notNullable()
                }).then(result=> {
                    console.log("tabla de mensajes creada")
                })
            }
        })
    }

    registerMessage = async (data) => {
        try {
            await messageDatabase.table("messages").insert(data)
            const messages = await messageDatabase.select().table("messages")
            return {status:"sucess", message:"mensajes encontrados", payload:messages}
        } catch(err) {
            return {status:"error", message: err}
        }
    }

    getMessages= async ()=> {
        try {
            const messages = await messageDatabase.select().table("messages")
            return {status:"success", message:"mensajes encontrados", payload:messages}
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    clearLog= async ()=> {
        try {
            await messageDatabase("messages").del().where("id","!=","null")
            const messages = await messageDatabase.select().table("messages")
            return {status:"success", message:"mensajes borrados", payload:messages}
        } catch (err) {
            return {status:"error", message: err}
        }
    }
}