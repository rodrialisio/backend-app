import { fileURLToPath } from "url"
import {dirname} from "path"
import bcrypt from "bcrypt"
import { createTransport } from "nodemailer"
import twilio from "twilio"

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)

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

export async function registerMessage(user) {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'catalina.harvey92@ethereal.email',
            pass: 'dvf8PMmbmJz2Hd2Z6J'
        }
    })
    const mail = {
        from: "Backend App Server",
        to: process.env.ADMIN_EMAIL,
        subject:"Nuevo Registro",
        html:`
            <h6>Nuevo usuario registrado:</h6>
            <p>email: ${user.id}</p>
            <p>nombre: ${user.name}</p>
            <p>apellido: ${user.last_name}</p>
            <p>edad: ${user.age}</p>
            <p>alias: ${user.alias}</p>
            <p>domicilio: ${user.adress}</p>
            <p>teléfono: ${user.phone}</p>
            <p>contraseña: ${user.password}</p>
        `,
        attachments: {
            path: user.avatar
        }
    }
    try {
        const result= await transporter.sendMail(mail)
        console.log("accepted:",result.accepted)
        return {status:"success", message:"mensaje de nuevo registro enviado"}
    } catch (err) {
        console.log(err)
        return {status:"error", message: err}
    }
}

export async function orderMessage(products,owner) {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'catalina.harvey92@ethereal.email',
            pass: 'dvf8PMmbmJz2Hd2Z6J'
        }
    })
    const order = products.map(product=> {
        return `<div>
                    <h3>${product.title}</h3>
                    <p>${product.price}</p>
                </div>
        `
    }).join("")
    const mail = {
        from: "Backend App Server",
        to: process.env.ADMIN_EMAIL,
        subject:`Nuevo pedido de ${owner}`,
        html: order
    }
    try {
        const result= await transporter.sendMail(mail)
        console.log("accepted:", result.accepted)
        return {status:"success", message: "correo de pedido enviado"}
    } catch (err) {
        console.log(err)
        return {status:"error", message: err}
    }
}

export async function phoneMessages(products,owner, ownerPhone) {
    const clientSid= "ACe259b298dd024994cdb308c81194d046"
    const authToken= "5bebfd0c959637eef8a280d96d9bd613"
    const number= "+19106065926"

    const client = twilio(clientSid, authToken)

    const order = `Nuevo pedido de ${owner}:` + products.map(product=> {
        return `
                    ${product.title}
                    $${product.price}
        `
    }).join(``)

    try {
        const whatsappMessage = await client.messages.create({
            from: "whatsapp:+14155238886", 
            to: process.env.ADMIN_WHATSAPP,
            body: order
        })
        const smsMessage = await client.messages.create({
            body: "Pedido a Backend-App recibido:"+order,
            from:"+19106065926",
            to: ownerPhone
        })
        return {status:"success", message: "mensajes de pedido enviado (whatsapp y sms)"}
    } catch (err) {
        console.log(err)
        return {status:"error", message: err}
    }
}









