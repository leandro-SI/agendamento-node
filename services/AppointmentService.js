var appointment = require('../models/Appointment')
var mongoose = require('mongoose');

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
            finished: false
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
            return await Appointment.find({'finished': false});
        }
    }

}

module.exports = new AppointmentService();