import multer from "multer"
import __dirname from "../utils.js"

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        console.log("uploading image")//////////////////////////////////////////////////////////////////
        if (file.fieldname==="image" || file.fieldname==="register-user-avatar") {
            //cb(null,__dirname+"public/images")            
            cb(null,"public/images") 
        } else if (file.fieldname==="document") {
            cb(null,"public/documentos") 
        }
    },
    filename: function (req,file,cb) {
        cb(null,Date.now()+file.originalname)
    }
})

const upload = multer({storage:storage})

export default upload