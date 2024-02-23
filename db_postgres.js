import { sql } from './db_connect.js';
import { randomUUID } from "crypto"

export class db_postgres{


    async list(search){
       let videos

       if (search){
           videos = await sql`SELECT * FROM videos WHERE title ILIKE ${search}`
           .catch((error) =>{console.log(error)})
        }
        else{
            videos = await sql`SELECT * FROM videos`
            .catch((error) =>{console.log(error)})
        }
        return videos
    }

    async create(video){
        const videoID = randomUUID()
        await sql`INSERT INTO videos (id, title, description, duration, zone) VALUES (${videoID}, ${video.title}, ${video.description}, ${video.duration}, ${video.zone})`
        .catch((error) =>{console.log(error)})
    }

    
    async update(id, video){
        await sql`UPDATE videos SET title = ${video.title}, description = ${video.description}, duration = ${video.duration}, zone = ${video.zone} WHERE id = ${id}`
        .catch((error) =>{console.log(error)})
    }

    
    async delete(id){
       await sql`DELETE FROM videos WHERE id = ${id}`
       .catch((error) =>{console.log(error)})
    }
}