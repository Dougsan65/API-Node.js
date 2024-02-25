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

    async create(video) {
        try {
            const videoID = randomUUID();
            await sql`INSERT INTO videos (id, title, description, duration, zone) VALUES (${videoID}, ${video.title}, ${video.description}, ${video.duration}, ${video.zone})`;
            return { success: true, message: 'Vídeo criado com sucesso!' };
        } catch (error) {
            console.error('Erro ao criar o vídeo:', error);
            return { success: false, message: 'Erro ao criar o vídeo. Por favor, tente novamente.' };
        }
    }
    

    
    async update(id, video){
        await sql`UPDATE videos SET title = ${video.title}, description = ${video.description}, duration = ${video.duration}, zone = ${video.zone} WHERE id = ${id}`
        .catch((error) =>{console.log(error)})
    }

    
    async delete(id){
       await sql`DELETE FROM videos WHERE id = ${id}`
       .catch((error) =>{console.log(error)})
    }

    async create_user(user){
        try {
            const userID = randomUUID();
            const currentDate = new Date()
            await sql`INSERT INTO usuariosregistrados (id, nomeusuario, email, senha, datacriacao) VALUES (${userID}, ${user.name}, ${user.email}, ${user.password}, ${currentDate})`;
            return { success: true, message: 'Usuário criado com sucesso!' };
        } catch (error) {
            console.error('Erro ao criar o usuário:', error);
            return { success: false, message: 'Erro ao criar o usuário. Por favor, tente novamente.' };
        }
    }
}