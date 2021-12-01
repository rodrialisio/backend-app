import  fs from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

const filename = fileURLToPath(import.meta.url)
const __dirname = dirname(filename)

export default __dirname

function makeId() {
    let id= ""
    let characters = [ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890]
    for (i=0; i<7; i++) {
        id += characters[Math.floor(Math.random() * characters.length)]
    }
    return id
}