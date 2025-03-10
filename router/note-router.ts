import express from "express";
import {upload} from "../util/multer";
import {Note} from "../module/Note";
import {
    changeFavourite,
    changeVisibility,
    deleteNote,
    getAllPublicNotes,
    getNotes,
    getNotesByUser,
    saveNote,
    update
} from "../db/prisma-data-note-store";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router()

router.post("/save" , upload.single('thumbnail') , async (req , res) => {
    const note : Note = req.body
    try{
        const savedNote = await saveNote(note, req.file!.path)
        console.log("saved note : ", savedNote)
        res.status(201).json(savedNote)
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

router.get("/getNoteByUser/:userName", async (req , res) => {
    const userName = req.params.userName
    try{
        const notes = await getNotesByUser(userName)
        console.log("get notes : ", notes)
        res.json(notes).status(200)
    } catch (err){
        console.log("error on get notes : ", err)
        res.status(500).send("error on get notes")
    }
})

router.put("/update/:noteId" , upload.single('thumbnail') , async (req , res) => {
    const noteId = req.params.noteId
    const note : Note = req.body
    try{
        const updatedNote = await update(note,noteId)
        console.log("updated note : ", updatedNote)
        res.json(updatedNote).status(201)
    } catch (err){
        console.log("error on update note : ", err)
        res.status(500).send("error on update note")
    }
})

router.delete("/delete/:noteId" , async (req , res) => {
    const noteId = req.params.noteId
    try{
        const deletedNote = await deleteNote(noteId)
        console.log("deleted note : ", deletedNote)
        res.status(201).json(deletedNote)
    } catch (err){
        console.log("error on delete note : ", err)
        res.status(500).send("error on delete note")
    }
})

router.get("/getPublicNotes", async (req , res) => {
    try{
        const notes = await getAllPublicNotes()
        console.log("get notes : ", notes)
        res.json(notes).status(200)
    } catch (err){
        console.log("error on get notes : ", err)
        res.status(500).send("error on get notes")
    }
})

router.put("/changeVisibility/:noteId" , async (req , res) => {
    const noteId = req.params.noteId
    const visibility = req.body.visibility
    try{
        const updatedNote = await changeVisibility(noteId, visibility)
        console.log("updated note : ", updatedNote)
        res.status(201).json(updatedNote)
    } catch (err){
        console.log("error on change visibility : ", err)
        res.status(500).send("error on change visibility")
    }
})

router.put("/changeFavourite/:noteId" , async (req , res) => {
    const noteId = req.params.noteId
    const isFavourite = req.body.isFavourite
    console.log("noteId : ", isFavourite)
    try{
        const updatedNote = await changeFavourite(noteId, isFavourite)
        console.log("updated note : ", updatedNote)
        res.status(201).json(updatedNote)
    } catch (err){
        console.log("error on change favourite : ", err)
        res.status(500).send("error on change favourite")
    }
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

router.get("/generateSummary" , async (req , res) => {
    const summary = req.query.summary as string;
    const sendMsg = `summarized \n\n${summary}`;
    console.log(sendMsg);
    try{
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(sendMsg);
        const response = await result.response;
        const text = response.text();
        res.json({ summary: text });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }

})

export default router