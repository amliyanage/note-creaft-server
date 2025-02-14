import dotenv from "dotenv";
import express from "express";
import {User} from "../module/User";
import {deleteUser, getUser, update} from "../db/prisma-data-user-store";
import {upload} from "../util/multer";

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
        res.status(500).send('Error fetching user data')
    }
})

router.put("/update/:username" , upload.single('profilePic') , async (req , res) => {
    const userName = req.params.username
    const user : User = req.body

    try{
        const updatedUser = await update(user,userName)
        console.log("updated user" , updatedUser)
        res.json(updatedUser).status(201)
    } catch (err){
        console.log("error on update user ; ", err)
        res.status(500).send("error on update ")
    }
})

router.delete("/delete/:username" , async (req,res) => {
    const username = req.params.username
    try{
        const deletedUser = await deleteUser(username)
        console.log("user deleted" , deletedUser)
        res.json(deletedUser).status(201)
    }catch (err){
        console.log("error on deleted user : ", err)
        res.status(500).send("error on delete user")
    }
})


export default router