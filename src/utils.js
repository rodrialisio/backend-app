import { fileURLToPath } from "url"
import {dirname} from "path"

export const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export function makeId() {
    let id= ""
    let characters = [ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890]
    for (i=0; i<7; i++) {
        id += characters[Math.floor(Math.random() * characters.length)]
    }
    return id
}





