const mongoose = require('mongoose')

// helper para parsear fechas tipo "DD/MM/YYYY" o ISO
function parseDateString(v) {
  if (!v) return v
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (m) {
      const day = Number(m[1]), month = Number(m[2]) - 1, year = Number(m[3])
      const d = new Date(year, month, day)
      return isNaN(d.getTime()) ? undefined : d
    }
    const dISO = new Date(v)
    return isNaN(dISO.getTime()) ? undefined : dISO
  }
  return v
}

let usuarioSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        minlength: 1
    },
    lastname:{
        type: String,
        required: true,
        minlength: 1
    },
    phone:{
        type: String,
        required: true,
        minlength: 1
    },
    direction:{
        type: String,
        required: true,
        minlength: 1
    },
    birthday:{
        type: Date,
        required: true,
        set: parseDateString
    },
    date_ini:{
        type: Date,
        set: parseDateString
    },
    date_finish:{
        type: Date,
        set: parseDateString
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
    },
    role:{
        type: [String],
        required: true,
        enum: ['admin', 'employee', 'client']
    },
    specialitation:{
        type: [String],
        enum:['neurologia', 'pediatrica', 'geriatrica', 'deportiva', 'respiratoria', 'ginecologia', 'oncologia',
            'traumatologia', 'cardiovascular', 'psiquiatria', 'estetica', 'paliativos']
    },
    EAN:{
        type: String,
        minlength: 1
    },
    imageUrl:{
        type: String
    }
}, {
  collection: 'usuarios',
  timestamps: true
})

const Usuario = mongoose.model('usuario', usuarioSchema)

let checkUser = new mongoose.Schema({
    _id:{
        type: Number,
        require: true,
        unique: true
    }
})

const citaSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  description: { type: String },
  usuarioId: { type: Number, ref: 'usuario', required: true } // _id de Usuario es Number
}, {
  timestamps: true
});

// Validación: end > start
citaSchema.pre('validate', function(next) {
  if (this.end <= this.start) {
    return next(new Error('end debe ser posterior a start'));
  }
  next();
});

citaSchema.index({ start: 1 });

const Cita = mongoose.model('cita', citaSchema);
module.exports = {
    usuario: Usuario,
    Cita
}