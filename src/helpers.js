const hbs = require('hbs')
const fs= require('fs')

let listaCursos
let listaInscritos

const cursos = () => {
    try{
        listaCursos = require('./cursos.json')
    }catch(error){
        listaCursos = []
    }
}
const inscritos = () => {
    try{
        listaInscritos = require('./inscritos.json')
    }catch(error){
        listaInscritos = []
    }
}

//Helpers CURSOS
hbs.registerHelper('crearCurso',(id ,nombre, intensidad, valor, descripcion, modalidad)=>{
    if (id == undefined) {
        return mostrarCursos()
    }
    if(!modalidad)  modalidad = ""
    const curso = {
        id,
        nombre,
        intensidad,
        valor,
        descripcion,
        modalidad,
        estado: "disponible"
    }
    cursos()
    let bool = listaCursos.some( cur => cur.id == id);
    if(!bool){
        listaCursos.push(curso)
        guardarCursos(listaCursos)
        let texto = mostrarCursos()
        texto = '<h4> Curso '+nombre+' creado!</h4>' + texto 
        return texto
    }else{
      return '<div class="alert alert-danger">\
                <strong>ERROR!</strong> ID repetido.\
              </div>' 
    }
})

hbs.registerHelper('listarCursosDisponibles',()=>{
    cursos()
    let texto= `<div class="col-sm-5">
                <select name="curso" class="browser-default custom-select" >
                <option disabled selected>Cursos Disponibles</option>`
    listaCursos.forEach(cur => {
        if(cur.estado == "disponible"){
            texto = texto + `<option value="${cur.id}">${cur.nombre}</option>`
        }
    });
    texto= texto + `</select> </div>`
 return texto
})

const mostrarCursos = () =>{
    cursos()
    let texto = `<center>
        <div class='accordion' id='accordion1'>
        <div class="card">
            <div class="card-header" id="headingOne">
                <button class="btn btn-success" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    Coordinador
                </button>
            </div>
        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion1">
        <div class="card-body">
            ${mostrarCursosAdmin()}
        </div>
        </div>
        </div>

        <div class="card">
            <div class="card-header" id="headingTwo">
                <button class="btn btn-success" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Interesado
                </button>
            </div>
        <div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordion1">
        <div class="card-body">
            ${mostrarCursosInteresado()}
        </div>
        </div>
        </div>

        </div>
        <br>
        <br>

   
    </center>`
    return texto
}

const guardarCursos = (listaCursos) =>{
    cursos()
    let datos = JSON.stringify(listaCursos)
    fs.writeFile('./src/cursos.json',datos,(err)=>{
        if (err) throw err 
    })
}

const mostrarCursosInteresado = ()=>{
    cursos()
    let texto = "<div class='accordion' id='accordionExample'>"
    let i = 1;
    listaCursos.forEach(cur => {
        if( cur.estado == "disponible"){
            texto = texto + `<div class="card">
                    <div class="card-header" id="heading${i}">
                    <h5 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                            Nombre del Curso: ${cur.nombre} <br>
                            Valor: ${cur.valor}
                        </button>
                    </h5>
                    </div>
                   
                    <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        Descripcion: ${cur.descripcion}<br>
                        Modalidad: ${cur.modalidad}<br>
                        Intensidad: ${cur.intensidad}
                    </div>
                    </div></div>`
        }   
        i = i + 1
    }); 
    texto = texto + `</div>`
    return texto
}

const mostrarCursosAdmin = ()=>{
    cursos()
    let texto = '<div class="col-sm">\
            <table class="table">\
                <thead class="bg-success">\
                <tr>\
                <th scope="col">\
                    <center>ID</center>\
                </th>\
                <th scope="col">\
                    <center>Nombre</center>\
                </th>\
                <th scope="col">\
                    <center>Descripcion</center>\
                </th>\
                <th scope="col">\
                    <center>Intensidad</center>\
                </th>\
                <th scope="col">\
                    <center>Valor</center>\
                </th>\
                <th scope="col">\
                    <center>Modalidad</center>\
                </th>\
                <th scope="col">\
                    <center>Estado</center>\
                </th>\
            </tr>\
        </thead>\
        <tbody>';
               
    listaCursos.forEach(cur => {
        texto = texto +
            '<tr>\
            <td class="text-center">'+cur.id+'</td>\
            <td class="text-center">'+cur.nombre+'</td>\
            <td class="text-center">'+cur.descripcion+'</td>\
            <td class="text-center">'+cur.intensidad+'</td>\
            <td class="text-center">'+cur.valor+'</td>\
            <td class="text-center">'+cur.modalidad+'</td>\
            <td class="text-center">'+cur.estado+'</td>\
            </tr>';
    }); 
    texto = texto + '</tbody></table></div>'
    return texto
}

//Helpers INSCRITOS
hbs.registerHelper('inscribir',(di, nombre, email, tel, curso)=>{
    cursos()
    inscritos()
    if (di == undefined) {
        return mostrarInscritos()
    }
    const inscrito = {
        di, nombre, email, tel, curso
    }
    let bool = listaInscritos.some( inscrito => inscrito.di == di && inscrito.curso == curso);
    if(!bool){
        listaInscritos.push(inscrito)
        guardarInscritos(listaInscritos)
        let texto = mostrarInscritos()
        let nomCurso = listaCursos.find(e => e.id == curso)
        texto = '<h4> Estudiante '+nombre+' inscrito en '+nomCurso.nombre+'!</h4>' + texto 
        return texto
    }else{
      return '<div class="alert alert-danger">\
                <strong>ERROR!</strong> Ya se encuentra inscrito en ese curso.\
              </div>' 
    }
})

hbs.registerHelper('cerrar',(id)=>{
    cursos()
    inscritos()
    listaCursos.forEach(cur => {
        if(cur.id==id) cur.estado = "cerrado"
    });
    guardarCursos(listaCursos)
})
hbs.registerHelper('eliminar',(curso, di) => {
    cursos()
    inscritos()
    let filtrado =  listaInscritos.filter(estu => !(estu.curso==curso && estu.di==di))
    guardarInscritos(filtrado)

})

const guardarInscritos = (inscritosFiltrado) =>{
    let datos = JSON.stringify(inscritosFiltrado)
    fs.writeFile('./src/inscritos.json',datos,(err)=>{
        if (err) throw err 
    })
    
}

const mostrarInscritos = () =>{
    cursos()
    inscritos()
    let texto = "<h5>Lista Inscritos por Curso</h5> <br> <div class='accordion' id='accordionExample'>"
    let i = 1,cont=1;
    listaCursos.forEach(cur => {
        if( cur.estado == "disponible"){
            texto = texto + `<div class="card">
                    <div class="card-header" id="heading${i}">
                    <h5 class="mb-0">
                        <button class="btn btn-link text-success" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                            Nombre del Curso: ${cur.nombre}
                        </button>
                        <form id="form1" action="/cursos" method="POST">
                        <input type="hidden" name="curso" value="${cur.id}" >
                        <button class="btn btn-danger" onclick="cerrar()">Cerrar</button> 
                        </form>
                    </h5>
                    </div>
                   
                    <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                    ${listarInscritos(cur.id)}
                    </div>
                    </div>
                    </div>`
            cont = cont + 1
        }   
        i = i + 1
    }); 
    texto = texto + `</div>`
    return texto
}

const listarInscritos = (curso) =>{
    cursos()
    inscritos()
    let texto = '<table class="table">\
    <thead class="bg-success">\
    <th>Documento</th>\
    <th>Nombre</th>\
    <th>Email</th>\
    <th>Telefono</th>\
    <th>Eliminar</th>\
    <thead><tbody>';

    listaInscritos.forEach(estu => {
        if(estu.curso == curso){
        texto = texto +
            `<tr>\
            <td>${estu.di}</td>\
            <td>${estu.nombre}</td>\
            <td>${estu.email}</td>\
            <td>${estu.tel}</td>\
            <td>

            <form id="form2" action="/inscritos" method="POST">
            <input type="hidden" name="curso" value="${curso}" >
            <input type="hidden" name="estudiante" value="${estu.di}" >
            <button type="submit" class="btn btn-danger" onclick="eliminar()">Eliminar</button> 
            </form>

            </td>\
            </tr>`;
        }
    }); 
    texto = texto + '</tbody></table>'
    return texto
}


