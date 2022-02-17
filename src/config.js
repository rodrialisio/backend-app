import knex from "knex";
import __dirname from "./utils.js";
import log4js from "log4js"

/* export const messageDatabase = knex({
    client:"sqlite3",
    connection: {filename: __dirname+"/DB/ecommerce.sqlite"}
}) */

export const productDatabase = knex({
    client: "mysql",
    version: "10.4.22", //"mysql --version" en cmd
    connection: {
        host: "127.0.0.1",
        port:3306,
        user:"root",
        password: "",
        database: "ecommerce"
    },
    pool: {min:0,max:10}
})

log4js.configure({
    appenders: {                    //tipo de persistencia
        console:{type:"console"},
        warningsFile: {type:"file", filename:"./warn.log"},
        errorsFile:{type:"file", filename:"./errors.log"},
        warningLevelFilter:{
            type: "logLevelFilter",
            level: "warn",
            maxLevel: "warn",
            appender: "warningsFile"
        },
        errorLevelFilter:{      
            type:"logLevelFilter",
            level: "error",
            maxLevel: "error",
            appender: "errorsFile"  // a este transport se le aplica este filtro
        } 
    },
    categories:{
        default: {
            appenders:["console"], level:"all"
        },
        dev: {
            appenders:["warningLevelFilter","errorLevelFilter","console"], level:"all" //persistencia con X para nivel X o mas
        },
        prod: {
            appenders:["errorLevelFilter","console"], level: "all"
        }
    }
})

export const logger = log4js.getLogger(process.env.NODE_ENV)
