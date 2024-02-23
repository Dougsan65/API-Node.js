import {fastify} from 'fastify'
import { db_postgres } from './db_postgres.js'
import 'dotenv/config'
const server = fastify()
const postgres = new db_postgres()

server.post('/videos', async (request, reply) =>{

    const {title, description, duration, zone} = request.body

    await postgres.create({
        title,
        description,
        duration,
        zone,
    })
    return reply.status(201).send()
} )

server.get('/videos', async (request, reply) =>{
    const search = request.query.search
    const videos = postgres.list(search)
    return videos
} )

server.get('/', ()=>{
    return '/videos to list all videos, /videos/:id to get a specific video, /videos to create a video, /videos/:id to update a video, /videos/:id to delete a video'
})

server.put('/videos/:id', async (request, reply) =>{
    const videoId = request.params.id
    const {title, description, duration, zone} = request.body

    postgres.update(videoId,{
        title,
        description,
        duration,
        zone
    })

    return reply.status(204).send()
} )

server.delete('/videos/:id', async (request, reply) =>{
    const videoId = request.params.id

    postgres.delete(videoId)
    return reply.status(200).send()
} )

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
})