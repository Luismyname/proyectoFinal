const mongoose = require('mongoose')

let usuarioSchema = new mongoose.Schema({
    id:{
        type: Number,
        require: true,
        unique: true
    },
    name:{
        type: String,
        require: true,
        minlength: 1
    },
    date_ini:{
        type: Date,
        require:true
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
        type: String,
        require: true,
        enum: ['admin', 'employee', 'client']
    },
})

let usuario = mongoose.model('usuario', usuarioSchema)

module.exports = {
    usuario: usuario
}