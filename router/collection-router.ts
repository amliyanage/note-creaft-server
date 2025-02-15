import express from "express";
import {CollectionList} from "../module/collectionList";
import {saveCollectionList} from "../db/prisma-data-collection-store";

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

export default router;