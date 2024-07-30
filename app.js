const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/agendamento").then(result => {
    console.log('Banco conectado!!')
}).catch(erro => console.log('Erro na conexão: ', erro))

app.get('/', (request, response) => {
    response.send('Teste')
})

app.get('/cadastro', (request, response) => {
    response.render('create')
})

app.listen(8080, () => {
    console.log('Servidor iniciado!!')
})