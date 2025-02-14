import {Note} from "../module/Note";
import cloudinary from "../util/cloudinary";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export async function saveNote(n : Note , file : string){
    try{
        const result = await cloudinary.uploader.upload(file,{folder : "note"})
        const savedNote = await prisma.note.create({
            data : {
                userName : n.userName,
                noteBody : n.noteBody,
                summery : n.summery,
                thumbnail : result.secure_url,
                isFavourite : n.isFavourite,
                date : new Date(),
                status : n.status,
            }
        })
        console.log("saved note : ", savedNote)
        return savedNote
    } catch (err){
        console.log("error on save note : ", err)
    }
}

export async function getNotes(noteId : string){
    try{
        const notes = await prisma.note.findMany({
            where : { noteId : noteId }
        })
        console.log("get notes : ", notes)
        return notes
    } catch (err){
        console.log("error on get notes : ", err)
    }
}

export async function getNotesByUser(userName : string){
    try{
        const notes = await prisma.note.findMany({
            where : { userName : userName }
        })
        console.log("get notes : ", notes)
        return notes
    } catch (err){
        console.log("error on get notes : ", err)
    }
}