const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  description: { type: String },
  usuarioId: { type: Number, ref: 'usuario' } // coincide con _id numérico de tu usuario
}, {
  timestamps: true
});

citaSchema.pre('validate', function(next) {
  if (this.end <= this.start) return next(new Error('end debe ser posterior a start'));
  next();
});

citaSchema.index({ start: 1 });

// Evitar OverwriteModelError: reutilizar modelo si ya existe
const Cita = mongoose.models.Cita || mongoose.model('Cita', citaSchema);
module.exports = Cita;