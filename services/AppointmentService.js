var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
var AppointmentFactory = require('../factories/AppointmentFactory');

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
        console.log(appos)
    }

}

module.exports = new AppointmentService();