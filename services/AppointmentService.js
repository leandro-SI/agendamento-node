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
            time
        });

        try {
            await new_appo.save();
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
        
    }

}

module.exports = new AppointmentService();