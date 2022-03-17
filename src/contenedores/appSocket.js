import ios from "socket.io-express-session"
import moment from "moment";

export function appSocket(server,products,mensajes,users,baseSession,io) {
    io.use(ios(baseSession))
    io.on("connection", async socket => {
        console.log(`El socket ${socket.id} se ha conectado.`)
        let productos = await products.getAll()
        socket.emit("updateProducts", productos)
        let messages = await mensajes.getMessages()
        socket.emit("messagelog",messages)
        socket.on("message", async data=> {
            const user = await users.getUserById(socket.handshake.session.user.userId)
            let time= moment()
            let message = {
                author: {
                    id: user.payload[0].id
                },            
                text: data.message,
                time: time.format("DD/MM/YYYY HH:mm")
            }
            mensajes.registerMessage(message).then(result => {
                io.emit("messagelog",result)
            })    
        })
        socket.on("clearLog", ()=> {
            mensajes.clearLog().then(result=> {
                io.emit("messagelog",result)
            })
        })
    })
}