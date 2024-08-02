var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
var AppointmentFactory = require('../factories/AppointmentFactory');
var mailer = require('nodemailer');

const Appointment = mongoose.model('Appointment', appointment)

class AppointmentService {

    create = async (name, email, description, cpf, date, time) => {
        var new_appo = new Appointment({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await new_appo.save();
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }        
    }

    getAll = async (showFinished) => {

        if (showFinished) {
            return await Appointment.find();
        } else {
            var appos = await Appointment.find({'finished': false});

            var appointments = [];
            
            appos.forEach(appointment => {
                if (appointment.date != undefined) {
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            });

            return appointments;
        }
    }

    getById = async (id) => {
        try {
            return await Appointment.findOne({_id: id});
        } catch (error) {
            console.log(error)
        }
    }

    finish = async (id) => {
        try {
            await Appointment.findByIdAndUpdate(id, {finished: true})
        } catch (error) {
            
        }
    }

    // Query => email ou cpf
    search = async (query) => {
        try {
            return await Appointment.find().or({email: query}, {cpf: query});
        } catch (error) {
            
        }
    }

    sendNotification = async () => {

        var appos = await this.getAll(false);

        var transporter = mailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 25,
            auth: {
                user: 'xxx',
                pass: 'xxx'
            }
        });

        appos.forEach( async app => {
            
            var date = app.start.getTime();
            var hour = 1000 * 60 * 60;
            var gap = date - Date.now();

            if (gap <= hour) {
                console.log(app.title);

                if (!app.notified) {

                    await Appointment.findByIdAndUpdate(app.id, {notified: true});

                    transporter.sendMail({
                        from: 'Leandro Almeida <agendamento@digitalbinary.com.br>',
                        to: app.email,
                        subject: 'Sua consulta irá acontecer em breve',
                        text: 'Conteúdo!!! Sua consulta irá acontecer em 1 hora'
                    }).then( () => {
                        console.log('Email enviado!!!')
                    }).catch(erro => {
                        console.log('Erro ao enviar email: ', erro)
                    })
                }
            }

        });

    }

}

module.exports = new AppointmentService();