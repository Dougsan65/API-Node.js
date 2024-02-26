import { fastify } from 'fastify';
import { db_postgres } from './db_postgres.js';
import jwt from 'jsonwebtoken';


import 'dotenv/config';
const server = fastify();
const postgres = new db_postgres();

server.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') {
        reply.status(200).send();
    } else {
        done();
    }
});

server.post('/registrarusuario', async (request, reply) => {
    try {
        const { name, email, password } = request.body;
        await postgres.create_user({
            name,
            email,
            password,
        });
        reply.status(201).send({ message: 'User created successfully!' });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Failed to create user' });
    }
});

server.get('/usuariosregistrados', async (request, reply) => {
    const search = request.query.search;
    const users = await postgres.list_users(search);
    return users;
});

server.get('/emailsregistrados', async (request, reply) => {
    const search = request.query.search;
    const emails = await postgres.list_emails(search);
    return emails;
});

server.post('/autenticacaologin', async (request, reply) => {
    const jwtSecret = process.env.JWT_SECRET;
    try {
        const { name, password } = request.body;
        const user = await postgres.verifyCredentials(name, password);

        
        const token = jwt.sign({ id: user[0].id, name: user[0].name }, jwtSecret, { expiresIn: '1h' });
        
        
        if (user.length > 0) {
            console.log(user)
            console.log(token)
            reply.status(200).send({ message: 'User authenticated successfully!', token: token});
        } else {
            reply.status(404).send({ error: 'Failed to authenticate user', });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Failed to authenticate user', });
    }
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

server.get('/videos', async (request, reply) => {
    const search = request.query.search;
    const videos = await postgres.list(search);
    return videos;
});

server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id;
    const { title, description, duration, zone } = request.body;

    await postgres.update(videoId, {
        title,
        description,
        duration,
        zone,
    });

    return reply.status(204).send();
});

server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id;

    await postgres.delete(videoId);
    return reply.status(200).send();
});

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
});
