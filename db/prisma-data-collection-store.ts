import { PrismaClient } from "@prisma/client";
import { CollectionList } from "../module/collectionList";
import {ProjectCollection} from "../module/projectCollection";

const prisma = new PrismaClient();

export async function saveCollectionList(c: CollectionList) {
    try {

        const savedCollectionList = await prisma.collectionList.create({
            data : {
                userName : c.userName
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
