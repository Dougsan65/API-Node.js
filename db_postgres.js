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

    async list_users(search){
        let users

        if (search){
            users = await sql`SELECT * FROM usuariosregistrados WHERE nomeusuario ILIKE ${search}`
            .catch((error) =>{console.log(error)})
         }
         else{
             users = await sql`SELECT * FROM usuariosregistrados`
             .catch((error) =>{console.log(error)})
         }
         return users
    }

    async list_emails(search){
        let emails

        if (search){
            emails = await sql`SELECT * FROM usuariosregistrados WHERE email ILIKE ${search}`
            .catch((error) =>{console.log(error)})
         }
         else{
             emails = await sql`SELECT * FROM usuariosregistrados`
             .catch((error) =>{console.log(error)})
         }
         return emails
    }

    async verifyCredentials(name, password){
        let user = await sql`SELECT * FROM usuariosregistrados WHERE nomeusuario = ${name} AND senha = ${password}`
        .catch((error) =>{console.log(error)})
        return user
    }

    async create_character(character){
        console.log(character.name, character.userID);
        const result = await sql`SELECT COUNT(nomepersonagem) AS total_personagens FROM personagens WHERE id_usuario = ${character.userID}`;
        const totalPersonagens = result[0].total_personagens;

        // Verificar se o usuário já possui mais de 3 personagens
        if (totalPersonagens >= 3) {
            return { success: false, message: 'Você já possui o número máximo de personagens.' };
        }

        try {
            const currentDate = new Date();
            await sql`INSERT INTO personagens (id_usuario, nomepersonagem, xp, nivel, datacriacao) VALUES (${character.userID}, ${character.name}, 0, 1, ${currentDate})`;
            return { success: true, message: 'Personagem criado com sucesso!' };
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Personagem com o mesmo nome já existe.');
            } else {
                throw new Error('Erro ao criar o personagem. Por favor, tente novamente.');
            }
            
        }
    }

    async list_characters(userID){
        let characters = await sql`SELECT * FROM personagens WHERE id_usuario = ${userID}`
        .catch((error) =>{console.log(error)})
        return characters
    }
    


}