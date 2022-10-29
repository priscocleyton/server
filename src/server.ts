import express from "express";
import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from "./utils/convert-hours-string-to-minutes";
import cors from "cors";

const app = express()
app.use(cors())

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

//TABELAS DO PRISCO

// Rota Transaction
app.get('/transactions', async (req, res) => {
    const transactions = await prisma.transaction.findMany()

    return res.json(transactions)
})

app.post('/transactions', async (request, response) => {   
    const body = request.body;

    if (!body.descricao) {
        return response.status(400).json({ "Error": "Campo descrição não encontrado" })
    }
    if (!body.saldo) {
        return response.status(400).json({ "Error": "Campo saldo não encontrado" })
    }

    const transaction = await prisma.transaction.create({
        data: {
            descricao: body.descricao,
            saldo: body.saldo,
            tipo: body.tipo,
            dataCriacao:  body.dataCriacao
        }
    })

    return response.status(201).json("Salvo com sucesso!")
})

//TABELAS DO HENRIQUE

//Rota Revenues
app.get('/revenues', async (req, res) => {
    const revenues = await prisma.revenuesTable.findMany()

    return res.json(revenues)
})

app.post('/revenues', async (request, response) => {   
    const body = request.body;

    if (!body.categoryOfRevenue) {
        return response.status(400).json({ "Error": "Campo descrição não encontrado" })
    }

    const revenues = await prisma.revenuesTable.create({
        data: {
            categoryOfRevenue: body.categoryOfRevenue,
            bills: body.bills,            
        }
    })

    return response.status(201).json("Salvo com sucesso!")
})

//Rota Expenses
app.get('/expenses', async (req, res) => {
    const expenses = await prisma.expensesTable.findMany()

    return res.json(expenses)
})

app.post('/expenses', async (request, response) => {   
    const body = request.body;

    if (!body.categoryOfExpenses) {
        return response.status(400).json({ "Error": "Campo descrição não encontrado" })
    }

    const expenses = await prisma.expensesTable.create({
        data: {
            categoryOfExpenses: body.categoryOfExpenses,
            bills: body.bills,            
        }
    })

    return response.status(201).json("Salvo com sucesso!")
})

//Rota Banks
app.get('/banks', async (req, res) => {
    const banks = await prisma.banks.findMany()

    return res.json(banks)
})

app.post('/banks', async (request, response) => {   
    const body = request.body;

    if (!body.bank) {
        return response.status(400).json({ "Error": "Campo descrição não encontrado" })
    }

    const banks = await prisma.banks.create({
        data: {
            bank: body.bank,                       
        }
    })
    return response.status(201).json("Salvo com sucesso!")
})


//Rota TransactionsTable
app.get('/newtransaction', async (req, res) => {
    const newtransaction = await prisma.transactionsTable.findMany()

    return res.json(newtransaction)
})

app.post('/newtransaction', async (request, response) => {   
    const body = request.body;

    if (!body.category) {
        return response.status(400).json({ "Error": "Campo descrição não encontrado" })
    }

    const newtransaction = await prisma.transactionsTable.create({
        data: {            
            type: body.type, 
            date: body.date,
            category: body.category,
            bills: body.bills,
            payment: body.payment,
            bank: body.bank,
            value: body.value,
            history: body.history 
        }
    })

    return response.status(201).json("Salvo com sucesso!")
})


//Rota PaymentMethod
app.get('/payment', async (req, res) => {
    const payment = await prisma.payment.findMany()

    return res.json(payment)
})

app.post('/payment', async (request, response) => {   
    const body = request.body;

    if (!body.payment) {
        return response.status(400).json({ "Error": "Campo 'payment' não encontrado" })
    }

    const payment = await prisma.payment.create({
        data: {
            description: body.payment                       
        }
    })
    return response.status(201).json("Salvo com sucesso!")
})

app.listen(3333)