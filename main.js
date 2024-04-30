

let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("get-image");

inputFile.onchange = function(){
    profilePic.src = URL.createObjectURL(inputFile.files[0]);
}

var paisesYCiudades = {
    "Ecuador": ["Cuenca", "Quito", "Guayaquil"],
    "Colombia": ["Cali", "Cartagena", "Bogotá"],
    "Argentina": ["La Plata", "Buenos Aires", "Salta"]
};

let cbxPaises = document.getElementById("pais");
let cbxCiudades = document.getElementById("ciudad");

// Agrega las opciones de países al combobox de países
cbxCiudades.innerHTML='<option disabled selected>Escoja una Ciudad</option>';
for (var k in paisesYCiudades) {
    var opt = document.createElement('option');
    opt.value = k;
    opt.innerHTML = k;
    cbxPaises.appendChild(opt);
}

function cargarCiudades(){
    // Limpia el combobox de ciudades
    cbxCiudades.innerHTML='<option disabled selected>Escoja una Ciudad</option>';

    // Obtiene el país seleccionado
    let pais = cbxPaises.value;
    
    // Agrega las ciudades correspondientes al país seleccionado al combobox de ciudades
    for (var j in paisesYCiudades[pais]) {
        var opt2 = document.createElement('option');
        opt2.value = paisesYCiudades[pais][j];
        opt2.innerHTML = paisesYCiudades[pais][j];
        cbxCiudades.appendChild(opt2);
    }
}

// Evento change y load para el combobox de países
cbxPaises.addEventListener('change', cargarCiudades);
window.addEventListener('load',cargarCiudades);


//Guardar formulario:
var datos = new Array(
    {ci:"0104515713",nombre:"Jonathan", apellido:"Ortega", direccion:"Del cebollar", telefono:"0985722090", date:"1997-12-21T02:35", pais:"Ecuador", ciudad:"Cuenca"},
    {ci:"1400464259",nombre:"Anita", apellido:"Molina", direccion:"Morona Santiago", telefono:"0999999999", date:"1978-05-07T02:00", pais:"Ecuador", ciudad:"Quito"},
    {ci:"0103808580",nombre:"Jhony", apellido:"Ortega", direccion:"Afura de macas", telefono:"0999999999", date:"1978-04-25T04:00", pais:"Ecuador", ciudad:"Macas"}
);
var tbl = document.getElementById('tabla_paciente');
var myBody = tbl.createTBody();
var guardar = document.getElementById('enviar');

tbl.appendChild(myBody);
guardar.addEventListener('click', function(event){
    event.preventDefault();
    addData();
});
window.addEventListener('load',updateTable);
window.addEventListener('load',DeleteData);

function addData(){
    if(validateData()==true && isValidCI(document.getElementById('cedula').value) && validarFechaYCalcularEdad()==true 
        && cbxCiudades.value!=="Escoja una Ciudad"){
        datos.push({ci:document.getElementById('cedula').value,
        nombre:document.getElementById('nombre').value,
        apellido:document.getElementById('apellido').value,
        direccion:document.getElementById('direccion').value,
        telefono:document.getElementById('telefono').value,
        date:document.getElementById('nacimiento').value,
        pais:document.getElementById('pais').value,
        ciudad:document.getElementById('ciudad').value
        });
        updateTable();
        document.getElementById('form-cliente').reset();
    }
}  

function DeleteData(){
    localStorage.clear();
}

function validateData(){
    // Validar que todos los campos estén completos
    var campos = ['cedula', 'nombre', 'apellido', 'direccion', 'telefono', 'nacimiento', 'pais', 'ciudad'];
    for (var i = 0; i < campos.length; i++) {
        if (document.getElementById(campos[i]).value === '') {
            alert("Por favor, complete todos los campos.");
            return false; // Detener la función si algún campo está vacío
        }
    }
    return true; // Devolver true si todos los campos están completos
}

function updateTable(){
    // Obtener los datos del array datos y del localStorage
    var datosLocalStorage = JSON.parse(localStorage.getItem("localData"));
    var datosActuales = datos.concat(datosLocalStorage);
    tbl.tBodies[0].innerHTML='';

    // Iterar sobre los datos y agregar filas a la tabla
    for(i=0; i<datosActuales.length-1; i++){
        var r = myBody.insertRow();
        var cci = r.insertCell();
        var cnombre = r.insertCell();
        var capellido = r.insertCell();
        var cdir = r.insertCell();
        var ctel = r.insertCell();
        var cdate = r.insertCell();
        var cpais = r.insertCell();
        var cciudad = r.insertCell();

        cci.innerHTML = datosActuales[i].ci;
        cnombre.innerHTML = datosActuales[i].nombre;
        capellido.innerHTML = datosActuales[i].apellido;
        cdir.innerHTML = datosActuales[i].direccion;
        ctel.innerHTML = datosActuales[i].telefono;
        cdate.innerHTML = datosActuales[i].date;
        cpais.innerHTML = datosActuales[i].pais;
        cciudad.innerHTML = datosActuales[i].ciudad;
    }
}

function isValidCI(ci) {
	var isNumeric = true;
	var total = 0, 
		individual;	

	for (var position = 0 ; position < 10 ; position++) {
		// Obtiene cada posición del número de cédula
		// Se convierte a string en caso de que 'ci' sea un valor numérico
		individual = ci.toString().substring(position, position + 1)

		if(isNaN(individual)) {
			isNumeric=false;				
			break;			
		} else {
			// Si la posición es menor a 9
			if(position < 9) {
				// Si la posición es par, osea 0, 2, 4, 6, 8.
				if(position % 2 == 0) {
					// Si el número individual de la cédula es mayor a 5
					if(parseInt(individual)*2 > 9) {
						// Se duplica el valor, se obtiene la parte decimal y se aumenta uno 
						// y se lo suma al total
						total += 1 + ((parseInt(individual)*2)%10);
					} else {
						// Si el número individual de la cédula es menor que 5 solo se lo duplica
						// y se lo suma al total
						total += parseInt(individual)*2;
					}
				// Si la posición es impar (1, 3, 5, 7)
				}else {
					// Se suma el número individual de la cédula al total
					total += parseInt(individual);		    		
				}
			} 
		}
	}

	if((total % 10) != 0) {
		total =  (total - (total%10) + 10) - total;		
	} else {
		total = 0 ; 	
	}


	if(isNumeric) {	
		// El total debe ser igual al último número de la cédula
		
		// La cédula debe contener al menos 10 dígitos
		if(ci.toString().length != 10) { 
			alert("La c\u00E9dula debe ser de: 10 d\u00EDgitos.");
			return false; 
		}

		// El número de cédula no debe ser cero
		if (parseInt(ci, 10) == 0) { 
			alert("La c\u00E9dula ingresada no puede ser cero.");
			return false;
		}

		// El total debe ser igual al último número de la cédula
		if(total != parseInt(individual)) { 
			alert("La c\u00E9dula ingresada no es v\u00E1lida.");
			return false;
		} 
		return true;			
	}

	// Si no es un número  
	alert("El dato solo puede contener numeros.");
	return false;
}

function validarFechaYCalcularEdad() {
    var fechaActual = new Date();
    var fechaIngresada = new Date(document.getElementById('nacimiento').value);

    if (fechaIngresada > fechaActual) {
        alert("La fecha de nacimiento no puede ser mayor que la fecha actual.");
        return false;
    }else{
        var diferencia = fechaActual - fechaIngresada;

        var años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
        var meses = Math.floor((diferencia % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * (365.25 / 12)));
        var dias = Math.floor((diferencia % (1000 * 60 * 60 * 24 * (365.25 / 12))) / (1000 * 60 * 60 * 24));
        var horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

        alert("Edad: " + años + " años, " + meses + " meses, " + dias + " días, " + horas + " horas, " + minutos + " minutos.");
        return true;
    }
}


//Cargar tabla consultas
var tblConsulta = document.getElementById('table_consultas');
var myBodyConsulta = tblConsulta.createTBody();

window.addEventListener('load',updateTableConsultas);

var consultas = new Array(
    {nombre:"Jonathan",date:"2023-04-25",obs:"El paciente muestra signos de cansancio"},
    {nombre:"Jonathan",date:"2024-04-25",obs:"El paciente ha mejorado"},
    {nombre:"Anita",date:"2022-04-23",obs:"Observacion para el paciente Anita"},
    {nombre:"Jhony",date:"2023-02-03",obs:"Observacion para el paciente Jhony"}
);

function updateTableConsultas(){
    // Iterar sobre los datos y agregar filas a la tabla
    for(i=0; i<consultas.length; i++){
        var r = myBodyConsulta.insertRow();
        var cnombre = r.insertCell();
        var cdate = r.insertCell();
        var cobs = r.insertCell();

        cnombre.innerHTML = consultas[i].nombre;
        cdate.innerHTML = consultas[i].date;
        cobs.innerHTML = consultas[i].obs;
    }
}

//Cargar tabla hijos
var tblHijos = document.getElementById('table_hijos');
var myBodyHijos = tblHijos.createTBody();

window.addEventListener('load', updateTableHijos);

var hijos = new Array(
    {paciente:"Jhony",ci:"0104515713", parentesco:"Padre-Hijo"},
    {paciente:"Anita",ci:"0104515713", parentesco:"Madre-Hijo"}
);

function updateTableHijos(){
for (i=0;i<hijos.length;i++){
    var r = myBodyHijos.insertRow();
    var cpaciente = r.insertCell();
    var cci = r.insertCell();
    var cparentesco = r.insertCell();

    cpaciente.innerHTML = hijos[i].paciente;
    cci.innerHTML = hijos[i].ci;
    cparentesco.innerHTML = hijos[i].parentesco;
}
}