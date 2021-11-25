import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        if (file.fieldname==="image") {
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