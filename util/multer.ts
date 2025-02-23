import multer from "multer";
import e from "express";

const storage = multer.diskStorage({
    destination : "uploads/",
    filename(req: e.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        let fileName : string
        if (!req.body.userName){
            fileName = req.body.id
        } else {
            fileName = req.body.userName
        }
        console.log(fileName)
        callback(null, `${fileName}-${file.originalname}`)
    }
})

export const upload = multer({storage})