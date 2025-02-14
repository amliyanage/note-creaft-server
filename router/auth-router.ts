import dotenv from "dotenv";
import express from "express";
import {add, verifyUser} from "../db/prisma-data-user-store";
import jwt, {Secret} from 'jsonwebtoken';
import {User} from "../module/User";
import {upload} from "../util/multer";

dotenv.config()

const router = express.Router()

router.post("/login", async (req, res) => {
    const userName = req.body.userName
    const password = req.body.password

    try {
        console.log(userName,password,"router")
        const isVerified = await verifyUser(userName, password)
        if(isVerified){
            console.log("Loaded secret key: ", process.env.REFRESH_TOKEN);
            const token = jwt.sign({userName : userName}, process.env.SECRET_KEY as Secret , { expiresIn : "1h" })
            console.log("token" , token)
            const refreshToken = jwt.sign({userName : userName}, process.env.REFRESH_TOKEN as Secret , { expiresIn : "7d" })
            console.log("refresh",refreshToken)
            res.json({token : token , refreshToken : refreshToken}).status(201)
        } else {
            res.json({message : "Invalid username or password"}).status(403)
        }
    } catch (err){
        console.log("error on login : ", err)
        res.send("Internal Serve Error").status(500)
    }
})

router.post("/register", upload.single('profilePic') ,async (req, res) => {
    const user :User = req.body

    try{
        const isSignedUp = await add(user, req.file!.path)
        res.json(isSignedUp).status(201)
    } catch (err){
        console.log("error on register : ", err)
        res.json({message : "Internal Server Error"}).status(401)
    }

})

export function authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log(token);
    if(!token)res.status(401).send('No token provided');

    try{

        console.log("Loaded secret key: ", process.env.SECRET_KEY);
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {username: string, iat: number};
        console.log(payload.username);
        req.body.username = payload.username;
        next();
    }catch(err){
        res.status(401).send(err);
    }
}

// TODO : Refresh Token


export default router