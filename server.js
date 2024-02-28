import { fastify } from 'fastify';
import { db_postgres } from './db_postgres.js';
import jwt from 'jsonwebtoken';


import 'dotenv/config';
const server = fastify();
const postgres = new db_postgres();

server.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', '*');
    reply.header('Access-Control-Allow-Headers', '*');
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

server.get('/usuariosregistrados', {preHandler: verifyToken}, async (request, reply) => {
    const search = request.query.search;
    const users = await postgres.list_users(search);
    console.log(request.user.id, request.user.name)
    return users;
});

server.get('/emailsregistrados',  {preHandler: verifyToken}, async (request, reply) => {
    const search = request.query.search;
    const emails = await postgres.list_emails(search);
    
    return emails;
});

server.post('/autenticacaologin', async (request, reply) => {
    const jwtSecret = process.env.JWT_SECRET;
    try {
        const { name, password } = request.body;
        const user = await postgres.verifyCredentials(name, password);
        console.log(user)

        
        const token = jwt.sign({ id: user[0].id, name: user[0].nomeusuario }, jwtSecret, { expiresIn: '1h' });
        
        
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

server.get('/verificartoken', {preHandler: verifyToken}, async (request, reply) => {
    reply.status(200).send({ message: 'Token verified successfully!' });
});









server.post('/videos', {preHandler: verifyToken}, async (request, reply) => {
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

server.get('/videos', {preHandler: verifyToken}, async (request, reply) => {
    const search = request.query.search;
    const videos = await postgres.list(search);
    console.log(request.user.id, request.user.name)
    return videos;
});

server.put('/videos/:id', {preHandler: verifyToken}, async (request, reply) => {
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

server.delete('/videos/:id', {preHandler: verifyToken}, async (request, reply) => {
    const videoId = request.params.id;

    await postgres.delete(videoId);
    return reply.status(200).send();
});

async function verifyToken(request, reply) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = request.headers.authorization;
    
    if (!token) {
        reply.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        request.user = decoded.name;
        console.log(decoded.id, decoded.name);
        request.user = {
            id: decoded.id,
            name: decoded.name,
        };
        
        return;
    } catch (error) {
        reply.status(401).send({ error: 'Failed to authenticate token' });
    }
}

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
});
