import express from "express";
import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from "./utils/convert-hours-string-to-minutes";

const app = express()

app.use(express.json())

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (request , response) => {
    const games =  await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games)
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays : body.weekDays.join(','),
            hourStart: convertHoursStringToMinutes(body.hourStart),
            hourEnd: convertHoursStringToMinutes(body.hourEnd),
            useVoiceChannel : body.useVoiceChannel
        }
    })

    return response.status(201).json(ad);
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourEnd: true,
            hourStart: true,        
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})

app.get('/ads', (request , response) => {

    return response.json([
        { id : '1', name : 'John',},
        { id : '2', name : 'Henrique',},
        { id : '3', name : 'Prisco',},
        { id : '4', name : 'Edivania',},
    ])
})

app.get('/ads/:id/discord', async (request , response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.json({
        discord: ad.discord
    })
})


app.get('/transactions', async (req, res) => {
    const transactions = await prisma.transaction.findMany()

    return res.json(transactions)
})

app.listen(3333)