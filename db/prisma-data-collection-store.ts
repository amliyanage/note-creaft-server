import { PrismaClient } from "@prisma/client";
import { CollectionList } from "../module/collectionList";
import {ProjectCollection} from "../module/projectCollection";

const prisma = new PrismaClient();

export async function saveCollectionList(c: CollectionList) {
    try {

        const savedCollectionList = await prisma.collectionList.create({
            data : {
                userName : c.userName,
                collectionName : c.collectionName
            }
        })

        await prisma.projectCollection.createMany({
            data : c.projectCollection.map((p : ProjectCollection) => {
                return {
                    listId :savedCollectionList.listId,
                    noteId : p.noteId
                }
            })
        })

        console.log("Saved collection list:", savedCollectionList);
        return savedCollectionList;
    } catch (err) {
        console.error("Error saving collection list:", err);
        throw err;
    }
}

export async function getCollectionList(userName : string){
    try{
        const collectionList = await prisma.collectionList.findFirst({
            where : { userName : userName }
        })
        console.log("get collection list : ", collectionList)
        return collectionList
    } catch (err){
        console.log("error on get collection list : ", err)
    }
}

export async function getProjectCollection(listId : string){
    try{
        const projectCollectionArray = await prisma.projectCollection.findMany({
            where : { listId : listId }
        })
        console.log("get project collection : ", projectCollectionArray)
        return projectCollectionArray
    } catch (err){
        console.log("error on get project collection : ", err)
    }
}