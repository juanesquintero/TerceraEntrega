const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser =  require('body-parser')
require('./helpers')
 
//Directorios
const directoriopublico = path.join(__dirname,'../public')
const directoriopartials = path.join(__dirname,'../partials')
// app.use(express.static(directoriopublico))
hbs.registerPartials(directoriopartials)

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'hbs')

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/crear',(req,res)=>{
    res.render('crear')
})
app.get('/cursos',(req,res)=>{
    res.render('cursos')
})
app.post('/cursos',(req,res)=>{
    let {curso, id, nombre, intensidad, valor, descripcion, modalidad} = req.body
    res.render('cursos',{
        curso: curso,
        id: id,
        nombre: nombre,
        intensidad: intensidad,
        valor: valor,
        descripcion: descripcion,
        modalidad: modalidad,
    })
})
app.get('/inscribir',(req,res)=>{
    res.render('inscribir')
})

app.get('/inscritos',(req,res)=>{
    res.render('inscritos')
})

app.post('/inscritos',(req,res)=>{
    let {di, nombre, email, tel, curso, estudiante} = req.body
    res.render('inscritos',{
        di: di ,
        nombre: nombre ,
        email: email ,
        tel: tel,
        curso: curso,
        estudiante: estudiante
    })
})

app.get('*',(req,res)=>{
    res.render('error')
})

//Port 
app.listen(3000,()=>{
    console.log('escuchando por el puerto 3000')
})