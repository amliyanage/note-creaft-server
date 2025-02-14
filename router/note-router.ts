import express from "express";
import {upload} from "../util/multer";
import {Note} from "../module/Note";
import {getNotes, saveNote} from "../db/prisma-data-note-store";

const router = express.Router()

router.post("/save" , upload.single('thumbnail') , async (req , res) => {
    const note : Note = req.body
    try{
        const savedNote = await saveNote(note, req.file!.path)
        console.log("saved note : ", savedNote)
        res.json(savedNote).status(201)
    } catch (err){
        console.log("error on save note : ", err)
        res.status(500).send("error on save note")
    }
})

router.get("/get/:noteId", async (req , res) => {
    const noteId = req.params.noteId
    try{
        const notes = await getNotes(noteId)
        console.log("get notes : ", notes)
        res.json(notes).status(200)
    } catch (err){
        console.log("error on get notes : ", err)
        res.status(500).send("error on get notes")
    }
})

export default router