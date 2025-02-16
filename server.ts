import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import authRouter, {authenticateToken} from "./router/auth-router";
import userRouter from "./router/user-router";
import noteRouter from "./router/note-router";
import collectionRouter from "./router/collection-router";

dotenv.config()
const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options('*', cors());

console.log("Loaded secret key : " , process.env.SECRET_KEY)

app.use('/auth' , authRouter);
app.use(authenticateToken);

app.use('/user', userRouter)
app.use('/note', noteRouter)
app.use("/collection" , collectionRouter)

app.listen(3000 , (err) => {
    console.log("server running on port 3000")
})