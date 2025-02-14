import dotenv from "dotenv";
import express from "express";
import {User} from "../module/User";
import {getUser} from "../db/prisma-data-user-store";

dotenv.config()

const router = express.Router()

router.get("/get/:userName", async (req, res) => {
    const userName = req.params.userName
    try {
        const user = await getUser(userName)
        console.log("user ", user)
        res.status(200).json(user)
    } catch (err) {
        console.log("error on get User ", err)
        res.status(400).send('Error fetching user data')
    }
})


export default router