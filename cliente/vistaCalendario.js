const { BrowserWindow } = require('@electron/remote');
const fetch = require('node-fetch');
const path = require('path');
const recurso = 'http://127.0.0.1:8080';

// Helper para normalizar módulos ESM/CJS
function norm(mod) {
  if (!mod) return null;
  return (mod && mod.default) ? mod.default : mod;
}

let CoreModule, dayGridModule, interactionModule;
try {
  CoreModule = norm(require('@fullcalendar/core'));
  dayGridModule = norm(require('@fullcalendar/daygrid'));
  interactionModule = norm(require('@fullcalendar/interaction'));
} catch (err) {
  console.warn('FullCalendar require() falló:', err);
  CoreModule = null;
  dayGridModule = null;
  interactionModule = null;
}

// Variables globales
let allClientes = [];
let allEmpleados = [];
let allCitas = [];
let selectedDate = null;

// Cargar clientes y empleados al inicio
async function loadClientsAndEmployees() {
  try {
    const clientRes = await fetch(`${recurso}/users4/client`);
    const empRes = await fetch(`${recurso}/users4/employee`);
    allClientes = await clientRes.json();
    allEmpleados = await empRes.json();
  } catch (err) {
    console.error('Error cargando clientes/empleados:', err);
  }
}

// Cargar todas las citas
async function loadAllAppointments() {
  try {
    const res = await fetch(`${recurso}/appointments`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    allCitas = await res.json();
  } catch (err) {
    console.error('Error cargando citas:', err);
  }
}

// Crear modal para nueva cita
function createAppointmentModal(startDate, endDate) {
  const modal = document.createElement('div');
  modal.id = 'appointment-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; width: 500px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
      <h2>Nueva Cita</h2>
      <form id="appointment-form">
        <div style="margin-bottom: 15px;">
          <label for="cliente-select">Cliente:</label>
          <select id="cliente-select" required style="width: 100%; padding: 8px;">
            <option value="">-- Selecciona cliente --</option>
            ${allClientes.map(c => `<option value="${c._id}">${c.name} ${c.lastname}</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label for="especialidad-select">Especialidad:</label>
          <select id="especialidad-select" required style="width: 100%; padding: 8px;">
            <option value="">-- Selecciona especialidad --</option>
            <option value="neurologia">Neurología</option>
            <option value="pediatrica">Pediátrica</option>
            <option value="geriatrica">Geriátrica</option>
            <option value="deportiva">Deportiva</option>
            <option value="respiratoria">Respiratoria</option>
            <option value="ginecologia">Ginecología</option>
            <option value="oncologia">Oncología</option>
            <option value="traumatologia">Traumatología</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="psiquiatria">Psiquiatría</option>
            <option value="estetica">Estética</option>
            <option value="paliativos">Paliativos</option>
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label for="empleado-select">Empleado disponible:</label>
          <select id="empleado-select" required style="width: 100%; padding: 8px;">
            <option value="">-- Selecciona especialidad primero --</option>
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" style="width: 100%; padding: 8px; height: 80px;"></textarea>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" id="cancel-btn" style="padding: 8px 16px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
          <button type="submit" style="padding: 8px 16px; background: #00aeff; color: white; border: none; border-radius: 4px; cursor: pointer;">Crear Cita</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Cerrar modal
  document.getElementById('cancel-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Filtrar empleados por especialidad
  const especialidadSelect = document.getElementById('especialidad-select');
  const empleadoSelect = document.getElementById('empleado-select');

  especialidadSelect.addEventListener('change', () => {
    const especialidad = especialidadSelect.value;
    empleadoSelect.innerHTML = '<option value="">-- Selecciona empleado --</option>';

    if (especialidad) {
      const empleadosDisponibles = allEmpleados.filter(emp =>
        Array.isArray(emp.specialitation) && emp.specialitation.includes(especialidad)
      );

      if (empleadosDisponibles.length === 0) {
        empleadoSelect.innerHTML += '<option disabled>No hay empleados con esta especialidad</option>';
      } else {
        empleadosDisponibles.forEach(emp => {
          empleadoSelect.innerHTML += `<option value="${emp._id}">${emp.name} ${emp.lastname}</option>`;
        });
      }
    }
  });

  // Enviar formulario
  document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clienteId = document.getElementById('cliente-select').value;
    const cliente = allClientes.find(c => c._id === Number(clienteId));
    const description = document.getElementById('descripcion').value;
    const empleadoId = document.getElementById('empleado-select').value;

    try {
      const res = await fetch(`${recurso}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: cliente ? `${cliente.name} ${cliente.lastname}` : 'Cliente',
          start: startDate,
          end: endDate,
          description: description || `Especialidad: ${document.getElementById('especialidad-select').value}`,
          usuarioId: Number(empleadoId)
        })
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      alert('Cita creada correctamente');
      modal.remove();
      if (typeof window.calendar !== 'undefined' && window.calendar.refetchEvents) {
        window.calendar.refetchEvents();
      }
      await loadAllAppointments();
    } catch (err) {
      console.error('Error creando cita:', err);
      alert('Error al crear la cita');
    }
  });
}

// Modal para listar y eliminar citas
function createDeleteAppointmentModal() {
  const modal = document.createElement('div');
  modal.id = 'delete-appointment-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const citasHtml = allCitas.length === 0 
    ? '<p style="text-align: center; color: #999;">No hay citas registradas</p>'
    : allCitas.map(cita => `
        <div style="background: #f9f9f9; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid #00aeff; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${cita.patientName}</strong><br>
            <small>${new Date(cita.start).toLocaleString()}</small><br>
            <small>${cita.description || 'Sin descripción'}</small>
          </div>
          <button type="button" data-id="${cita._id}" class="delete-cita-btn" style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
        </div>
      `).join('');

  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
      <h2>Gestionar Citas</h2>
      <div id="citas-list" style="margin-bottom: 20px;">
        ${citasHtml}
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button type="button" id="close-delete-modal" style="padding: 8px 16px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">Cerrar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-delete-modal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Botones de eliminar citas
  document.querySelectorAll('.delete-cita-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const citaId = e.target.dataset.id;
      if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        try {
          const res = await fetch(`${recurso}/appointments/${citaId}`, {
            method: 'DELETE'
          });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          alert('Cita eliminada correctamente');
          modal.remove();
          await loadAllAppointments();
          if (typeof window.calendar !== 'undefined' && window.calendar.refetchEvents) {
            window.calendar.refetchEvents();
          }
        } catch (err) {
          console.error('Error eliminando cita:', err);
          alert('Error al eliminar la cita');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  // Cargar datos
  await loadClientsAndEmployees();
  await loadAllAppointments();

  // Si require falló, intentar dynamic import
  if (!CoreModule) {
    try {
      const core = await import('@fullcalendar/core');
      const daygrid = await import('@fullcalendar/daygrid');
      const interaction = await import('@fullcalendar/interaction');
      CoreModule = norm(core);
      dayGridModule = norm(daygrid);
      interactionModule = norm(interaction);
    } catch (err) {
      console.error('No se pudo cargar FullCalendar:', err);
      return;
    }
  }

  const Calendar = CoreModule.Calendar || CoreModule;
  const dayGridPlugin = dayGridModule;
  const interactionPlugin = interactionModule;

  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('No se encontró el elemento #calendar');
    return;
  }

  window.calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin].filter(Boolean),
    initialView: 'dayGridMonth',
    events: async (info, successCallback, failureCallback) => {
      try {
        const res = await fetch(`${recurso}/appointments`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        successCallback(data);
      } catch (err) {
        console.error('Error cargando eventos:', err);
        failureCallback(err);
      }
    },
    selectable: true,
    select: (info) => {
      // Abrir modal al seleccionar rango de fechas
      createAppointmentModal(info.startStr, info.endStr);
    },
    eventClick: (info) => {
      // Al hacer click en un evento, mostrar opción de eliminar
      if (confirm(`¿Deseas eliminar la cita "${info.event.title}"?`)) {
        deleteAppointment(info.event.id);
      }
    }
  });

  window.calendar.render();
});

async function deleteAppointment(citaId) {
  try {
    const res = await fetch(`${recurso}/appointments/${citaId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    alert('Cita eliminada correctamente');
    if (typeof window.calendar !== 'undefined' && window.calendar.refetchEvents) {
      window.calendar.refetchEvents();
    }
    await loadAllAppointments();
  } catch (err) {
    console.error('Error eliminando cita:', err);
    alert('Error al eliminar la cita');
  }
}

// navegación entre páginas — comprueba existencia antes de añadir listener
const elPagina = document.getElementById('pagina-principal');
if (elPagina) elPagina.addEventListener('click', () => BrowserWindow.getFocusedWindow().loadFile('employee.html'));

const elCliente = document.getElementById('cliente-principal');
if (elCliente) elCliente.addEventListener('click', () => BrowserWindow.getFocusedWindow().loadFile('vistaClientes.html'));

const elEmpleado = document.getElementById('empleado-principal');
if (elEmpleado) elEmpleado.addEventListener('click', () => BrowserWindow.getFocusedWindow().loadFile('vistaEmpleados.html'));

const elPagos = document.getElementById('pagos-principal');
if (elPagos) elPagos.addEventListener('click', () => BrowserWindow.getFocusedWindow().loadFile('vistaPagos.html'));

// Botón para gestionar/eliminar citas (opcional, si añades un botón en el HTML)
const btnGestionarCitas = document.getElementById('gestionar-citas-btn');
if (btnGestionarCitas) {
  btnGestionarCitas.addEventListener('click', () => createDeleteAppointmentModal());
}

// Botón cerrar sesión
let btnCerrarSesion = document.getElementById('btn-cerrar-sesion')

btnCerrarSesion.addEventListener('click', () => {
    BrowserWindow.getFocusedWindow().loadFile('index.html');
})