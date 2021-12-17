import knex from "knex";
import __dirname from "./utils.js";

export const messageDatabase = knex({
    client:"sqlite3",
    connection: {filename: __dirname+"/DB/ecommerce.sqlite"}
})

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

