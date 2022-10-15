import express from "express";

const app = express()

app.get('/ads', (request , response) => {

    return response.json([
        { id : '1', name : 'John',},
        { id : '2', name : 'Henrique',},
        { id : '3', name : 'Prisco',},
        { id : '4', name : 'Edivania',},
    ])
})

app.listen(3333)