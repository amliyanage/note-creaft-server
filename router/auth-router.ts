import dotenv from "dotenv";
import express from "express";
import {add, verifyUser} from "../db/prisma-data-user-store";
import jwt, {Secret} from 'jsonwebtoken';
import {User} from "../module/User";
import {upload} from "../util/multer";
import {OAuth2Client} from "google-auth-library";
import SendMail, {verifyOTP} from "../util/sendMail";

dotenv.config()

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

async function verifyGoogleToken(idToken: string) {
    console.log("Loaded secret key: ", idToken);
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Ensure the token is for your app
    });
    const payload = ticket.getPayload();
    return payload;  // Contains the user's Google profile data
}

router.post("/login", async (req, res) => {
    const userName = req.body.userName
    const password = req.body.password

    try {
        console.log(userName,password,"router")
        const isVerified = await verifyUser(userName, password)
        if(isVerified){
            console.log("Loaded secret key: ", process.env.REFRESH_TOKEN);
            const token = jwt.sign({userName : userName}, process.env.SECRET_KEY as Secret , { expiresIn : "7d" })
            console.log("token" , token)
            const refreshToken = jwt.sign({userName : userName}, process.env.REFRESH_TOKEN as Secret , { expiresIn : "7d" })
            console.log("refresh",refreshToken)
            res.status(201).json({token : token , refreshToken : refreshToken , username : userName})
        } else {
            res.status(403).json({ message: "Invalid username or password" });
        }
    } catch (err){
        console.log("error on login : ", err)
        res.send("Internal Serve Error").status(500)
    }
})

router.post("/google-login", async (req, res) => {
    const token = req.body.token
    console.log("ena eka",token)

    try {
        const googleUser= await verifyGoogleToken(token)
        const user = await verifyUser(googleUser?.sub as string, "")
        if(user){
            console.log("Loaded secre   t key: ", process.env.REFRESH_TOKEN);
            const token = jwt.sign({userName : googleUser?.sub as string}, process.env.SECRET_KEY as Secret , { expiresIn : "7d" })
            console.log("token" , token)
            const refreshToken = jwt.sign({userName : googleUser?.sub as string}, process.env.REFRESH_TOKEN as Secret , { expiresIn : "7d" })
            console.log("refresh",refreshToken)
            console.log("user",googleUser?.sub)
            res.status(201).json({token : token , refreshToken : refreshToken , username : googleUser?.sub})
        } else {
            res.status(403).json({ message: "Invalid username or password" });
        }
    } catch (err){
        console.log("error on google login : ", err)
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

router.post('/google-signup' , async (req , res) => {
    const token = req.body.token.token
    console.log("ena eka",token)

    try {
        const googleUser= await verifyGoogleToken(token)
        const user : User = {
            userName : googleUser?.sub as string,
            email : googleUser?.email as string,
            password : "",
            name : googleUser?.name as string,
            profilePic : googleUser?.picture as string,
            fp : "false"
        }
        const isSignedUp = await add(user, googleUser?.picture as string)
        res.json(isSignedUp).status(201)
    } catch (err) {
        console.log("error on google signup : ", err)
        res.json({message: "Internal Server Error"}).status(401)
    }
})

export function  authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
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

router.post("/refresh-token", async (req, res) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader?.split(' ')[1];

    if(!refresh_token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as Secret) as {username: string, iat: number};
        const token = jwt.sign({ username: payload.username }, process.env.SECRET_KEY as Secret, {expiresIn: "1m"});
        res.status(201).json({token : token});
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
})

router.post("/send-email/:email" , async (req , res) => {
    const email = req.params.email

    try{
        const response = await SendMail(email)
        if (response != null){
            res.status(201).json(response)
        } else {
            res.status(401).json({message: "Invalid email"})
        }
    }catch (err){
        console.log("error on send email : ", err)
        res.json({message : "Internal Server Error"}).status(401)
    }
})

router.post("/verify-otp/:email/:otp" , async (req , res) => {
    const email = req.params.email
    const otp = req.params.otp

    const isVerified = verifyOTP(email, otp)
    if(isVerified){
        // send token
        console.log("Loaded secret key: ", process.env.SECRET_KEY);
        const payload = jwt.sign({userName : email}, process.env.SECRET_KEY as Secret , { expiresIn : "7d" })
        console.log("token" , payload)
        const refreshToken = jwt.sign({userName : email}, process.env.REFRESH_TOKEN as Secret , { expiresIn : "7d" })
        console.log("refresh",refreshToken)
        res.status(201).json({token : payload , refreshToken : refreshToken , username : isVerified})
    } else {
        res.status(401).json({message : "Invalid OTP"})
    }
})


export default router