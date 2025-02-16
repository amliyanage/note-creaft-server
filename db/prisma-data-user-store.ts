import { PrismaClient } from "@prisma/client";
import {User} from "../module/User";
import cloudinary from "../util/cloudinary";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export async function add(u : User , file : string){
    try{
        const result = await cloudinary.uploader.upload(file,{folder : "user"})
        const hashPassword = await bcrypt.hash(u.password, 10)
        const saveUser = await prisma.user.create({
            data : {
                userName : u.userName,
                fp : u.fp,
                password : hashPassword,
                name : u.name,
                email : u.email ,
                profilePic : result.secure_url
            }
        })
        console.log("save user : " , saveUser)
        return saveUser
    } catch (err){
        console.log("error on save user : ",err)
    }
}

export async function update(u : User , userName : string){
    try{
        if(u.profilePic){
            const oldImagePublicId = u.profilePic.split("/").pop()?.split(".")[0]
            await cloudinary.uploader.destroy(`user/${oldImagePublicId}`)
        }
        const result = await cloudinary.uploader.upload(u.profilePic, {folder : "user"})
        const hashPassword = await bcrypt.hash(u.password, 10)
        const updateUser = await prisma.user.update({
            where : { userName : userName },
            data : {
                name : u.name,
                password : hashPassword,
                email : u.email,
                fp : u.fp,
                profilePic : result.secure_url
            }
        })
        console.log("updated user : " , updateUser)
        return updateUser
    } catch (err){
        console.log("error on update user : ",err)
    }
}

export async function getUser(userName : string){
    try{
        const user = await prisma.user.findFirst({
            where : { userName : userName }
        })
        console.log("get user data : " , user)
        return user
    } catch (err){
        console.log("error on get user : ",err)
    }
}

export async function deleteUser(userName : string){
    try{
        const user = await prisma.user.delete({
            where : { userName : userName }
        })
        const oldImagePublicId = user.profilePic.split("/").pop()?.split(".")[0]
        await cloudinary.uploader.destroy(`user/${oldImagePublicId}`)
        console.log("deleted user : " , user)
        return user
    } catch (err){
        console.log("error on delete user : ",err)
    }
}

export async function getAllUser(){
    try {
        const users = await prisma.user.findMany()
        console.log("get all users : ", users)
        return users
    } catch (err){
        console.log("error on get all users : ", err)
    }
}

export async function verifyUser(userName : string , password : string){
    try{
        console.log(userName,password)
        const user = await prisma.user.findFirst({
            where : { userName : userName }
        })
        console.log("verified user : ", user)
        if(!user){
            return false
        }
        return await bcrypt.compare(password, user.password)
    } catch (err){
        console.log("error on verify user : ", err)
    }
}

export async function verifyGoogleUser(userName : string){
    try{
        const user = await prisma.user.findFirst({
            where : { userName : userName }
        })
        console.log("verified google user : ", user)
        return user
    } catch (err){
        console.log("error on verify google user : ", err)
    }
}