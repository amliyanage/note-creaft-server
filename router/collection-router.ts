import express from "express";
import {CollectionList} from "../module/collectionList";
import {
    deleteCollectionList,
    getCollectionList,
    getProjectCollection,
    saveCollectionList, updateCollectionList
} from "../db/prisma-data-collection-store";

const router = express.Router()

router.post("save" , async (req , res) => {
    const collection : CollectionList = req.body

    try{
        const savedCollection = await saveCollectionList(collection)
        console.log("saved collection : ", savedCollection)
        res.json(savedCollection).status(201)
    } catch (err){
        console.log("error on save collection : ", err)
        res.status(500).send("error on save collection")
    }
})

router.get("/get/:userName" , async (req , res) => {
    const userName = req.params.userName

    try{
        const collection = await getCollectionList(userName)
        console.log("get collection : ", collection)
        res.json(collection).status(200)
    } catch (err){
        console.log("error on get collection : ", err)
        res.status(500).send("error on get collection")
    }
})

router.get("/get/:listId" , async (req , res) => {
    const listId = req.params.listId

    try{
        const projectCollection = await getProjectCollection(listId)
        console.log("get project collection : ", projectCollection)
        res.json(projectCollection).status(200)
    } catch (err){
        console.log("error on get project collection : ", err)
        res.status(500).send("error on get project collection")
    }
})

router.delete("/delete/:listId" , async (req , res) => {
    const listId = req.params.listId

    try{
        const deletedCollection = await deleteCollectionList(listId)
        console.log("deleted collection : ", deletedCollection)
        res.json(deletedCollection).status(200)
    } catch (err){
        console.log("error on delete collection : ", err)
        res.status(500).send("error on delete collection")
    }
})

router.put("/update/:listId" , async (req , res) => {
    const listId = req.params.listId
    const collection : CollectionList = req.body

    try{
        const updatedCollection = await updateCollectionList(collection, listId)
        console.log("updated collection : ", updatedCollection)
        res.json(updatedCollection).status(200)
    } catch (err){
        console.log("error on update collection : ", err)
        res.status(500).send("error on update collection")
    }
})

export default router;