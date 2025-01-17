const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentService = require('./services/AppointmentService');
const AppointmentService = require('./services/AppointmentService');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/agendamento").then(result => {
    console.log('Banco conectado!!')
}).catch(erro => console.log('Erro na conexão: ', erro))

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/cadastro', (request, response) => {
    response.render('create')
})

app.post('/create', async (request, response) => {

    const {name, email, description, cpf, date, time} = request.body;

    var result = await appointmentService.create(name, email, description, cpf, date, time);

    if (result){
        response.redirect('/')
    }else {
        response.send('Ocorreu uma falha')
    }
})

app.get('/get-calendar', async (request, response) => {
    
    var appointments = await AppointmentService.getAll(false);

    response.json(appointments);
})

app.get('/event/:id', async (request, response) => {

    var appointment = await AppointmentService.getById(request.params.id);
    response.render('event', {appo: appointment})
});

app.post('/finish', async function (request, response) {
    var id = request.body.id;
    var result = await AppointmentService.finish(id);
    response.redirect('/');
})

app.get('/list', async (request, response) => {
    var appos = await AppointmentService.getAll(true);
    response.render('list', {appos});
})

app.get('/search', async (request, response) => {
    var appos = await AppointmentService.search(request.query.search)
    response.render('list', {appos});
})

var pullTime = 1 * 60000;

setInterval(async () => {
    
    await AppointmentService.sendNotification();

}, 5000);


app.listen(8080, () => {
    console.log('Servidor iniciado!! http://localhost:8080')
})