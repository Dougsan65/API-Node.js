import {fastify} from 'fastify'
import { db_postgres } from './db_postgres.js'

import 'dotenv/config'
const server = fastify()
const postgres = new db_postgres()

server.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    done();
});



server.options('/videos', async (request, reply) => {
    reply.status(200).send();
});

server.post('/videos', async (request, reply) => {
    try {
        const { title, description, duration, zone } = request.body;

        await postgres.create({
            title,
            description,
            duration,
            zone,
        });

        reply.status(201).send({ message: 'Video created successfully!' });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Failed to create video' });
    }
});


server.get('/videos', async (request, reply) =>{
    const search = request.query.search
    const videos = await postgres.list(search)
    return videos
} )

server.put('/videos/:id', async (request, reply) =>{
    const videoId = request.params.id
    const {title, description, duration, zone} = request.body

    await postgres.update(videoId,{
        title,
        description,
        duration,
        zone
    })

    return reply.status(204).send()
} )

server.delete('/videos/:id', async (request, reply) =>{
    const videoId = request.params.id

    await postgres.delete(videoId)
    return reply.status(200).send()
} )

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
})