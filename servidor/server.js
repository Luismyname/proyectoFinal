const express = require('express')
const bodyParser = require('body-parser')
let app = express()
const { usuario } = require('./usuarios/modelUsuario') //modelo de usuarios
const mongoose = require('mongoose')
const fs = require('fs')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/psioterapia')

app.use(bodyParser.json())

//busca a todos los usuarios
app.get('/users', (req, res) =>{
    usuario.find()
        .then(users => res.send(users))
        .catch(error =>{
            console.log('Error', error)
        })
})

//busca un email
app.get('/users/:email', (req, res) => {
    usuario.find({email: {$regex: req.params.email}})
        .then(result => {
            if (!result || result.length === 0) {
                res.status(404).json({error: 'Este correo electronico no existe'});
            } else {
                res.json(result);
            }
        })
        .catch(error => {
            res.status(500).json({error: 'Error en el servidor'});
        });
})

//busca la contraseña
app.get('/users1/:password', (req, res)=>{
    usuario.find({password: {$regex: req.params.password}})
        .then(result =>{
            res.send(result)
        }).catch(error =>{
            res.send('Contraseña erronea')
        })
})

//busca usuarios por nombre
app.get('/users2/:name', (req, res)=>{
    usuario.find({name: {$regex: req.params.name}})
        .then(result =>{
            res.send(result)
        }).catch(error =>{
            res.send('Nombre no encontrado')
        })
})

//busca usuarios por fecha de nacimiento
app.get('/users3/:date_ini', (req, res)=>{
    usuario.find({date_ini: {$regex: req.params.date_ini}})
        .then(result =>{
            res.send(result)
        }).catch(error =>{
            res.send('No hay usuario con esta fecha de nacimiento')
        })
})

//busca usuarios por id
app.get('/users0/:id', (req, res)=>{
    const idNum = Number(req.params.id)
    if(isNaN(idNum)){
        return res.status(400).json({error: 'ID invalido'})
    }

    usuario.find({id: idNum})
        .then(result =>{
            res.send(result)
        }).catch(error =>{
            res.status(500).json({error: 'Error a buscar por id'})
        })
})

//busqueda de role
app.get('/users4/:role', (req, res) => {
    usuario.find({ role: { $in: [req.params.role] } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con este rol');
        });
});

//busqueda de lastname
app.get('/users5/:lastname', (req, res) => {
    usuario.find({ lastname: { $regex: req.params.lastname } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con este apellido');
        });
});

// busqueda de phone
app.get('/users6/:phone', (req, res) => {
    usuario.find({ phone: { $regex: req.params.phone } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con este telefono');
        });
});

//busqueda de direction
app.get('/users7/:direction', (req, res) => {
    usuario.find({ direction: { $regex: req.params.direction } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con esta direccion');
        });
});

//busqueda de birthday
app.get('/users8/:birthday', (req, res) => {
    usuario.find({ birthday: { $regex: req.params.birthday } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con esta fecha de nacimiento');
        });
});

//busqueda de date_finish
app.get('/users9/:date_finish', (req, res) => {
    usuario.find({ date_finish: { $regex: req.params.date_finish } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con esta fecha de finalización');
        });
});

//busqueda de specialitation
app.get('/users10/:specialitation', (req, res) => {
    usuario.find({ specialitation: { $regex: req.params.specialitation } })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(404).send('No hay usuarios con esta especialidad');
        });
});

//añadir usuario
app.post('/users', async (req, res)=>{
    try{
        let nuevoUsuario = new usuario(req.body)
        await nuevoUsuario.save()
        res.send({ok: true})
    }catch(error){
        res.send({ok: false, error})
    }
})

//eliminar usuario
app.delete('/users/:id', async (req, res)=>{
    try{
        await usuario.deleteOne({id: req.params.id})
        res.send({ok: true})
    }catch(error){
        res.send({ok: false, error})
    }
})



let fichero = fs.readFileSync('./usuarios/usuarios.json')
let usuari = JSON.parse(fichero)

usuario.insertMany(usuari)
    .then((docs) => {console.log('datos insertados correctamente:', docs) })
    .catch((e)=>{ console.log('Error al insertar datos:', e)})


app.listen(8080)