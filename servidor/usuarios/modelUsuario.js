const mongoose = require('mongoose')

let usuarioSchema = new mongoose.Schema({
    _id:{
        type: Number,
        require: true,
        unique: true
    },
    name:{
        type: String,
        require: true,
        minlength: 1
    },
    lastname:{
        type: String,
        require: true,
        minlength: 1
    },
    phone:{
        type: String,
        require: true,
        minlength: 1
    },
    direction:{
        type: String,
        require: true,
        minlength: 1
    },
    birthday:{
        type: Date,
        require: true
    },
    date_ini:{
        type: Date,
        require:true
    },
    date_finish:{
        type: Date,
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: [String],
        require: true,
        enum: ['admin', 'employee', 'client']
    },
    specialitation:{
        type: [String],
        enum:['neurologia', 'pediatrica', 'geriatrica', 'deportiva', 'respiratoria', 'ginecologia', 'oncologia',
            'traumatologia', 'cardiovascular', 'psiquiatria', 'estetica', 'paliativos']
    },
    EAN:{
        type: String,
        require: true,
        minlength: 1
    }
})

let usuario = mongoose.model('usuario', usuarioSchema)

let checkUser = new mongoose.Schema({
    _id:{
        type: Number,
        require: true,
        unique: true
    }
})

module.exports = {
    usuario: usuario
}