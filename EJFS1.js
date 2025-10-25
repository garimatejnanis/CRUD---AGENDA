//Se crea la clase.
class Contacto{

    constructor(){};

    //Petición asincrona (AJAX).
    createContacto(){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function(){
    //Se comprueba si la petición se completo.
            if (this.readyState == 4 && this.status == 200){
                //Limpiar los campos del formulario a la hora de enviar un formulario.
                    document.getElementById("nombre").value = ""; 
                    document.getElementById("telefono").value = "";   
                    document.getElementById("email").value = ""; 
                
                //Convierto la respuesta en JSON.
                let datosContacto = JSON.parse(this.responseText);

                //Comprobación el resultado devuelto por PHP.
                    if (datosContacto["resultado"] == false){
                
                //Mesaje de error.
                        console.log("Contacto no agregado."); 
                        alert(datosContacto["mensaje"]);          
                    } else if (datosContacto["resultado"] == true){
                        console.log("Contacto agregado."); 
                //Actualiza la tabla.
                        contacto.readInfoContacto();
                        document.getElementById('formularioEdit').style.display = "none";     

                };
            };    
            
        };

        //Obtener valores del formulario.
        let nombre = document.getElementById("nombre").value;
        let telefono = document.getElementById("telefono").value;
        let email = document.getElementById("email").value;

        //Se preparan los parametros para enviar.
        let params = "nombre=" + nombre + "&telefono=" + telefono + "&email=" + email;
        
        //Configurar la petición POST a PHP y enviarla.
        xhttp.open("POST", "EJFS1.php?accion=createContacto", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);

        //Evita que nose recarge al enviar.
        return false;
    }

    //Petición asincrona (AJAX).
    readInfoContacto(){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function(){
    //Se comprueba si la petición se completo.
            if (this.readyState == 4 && this.status == 200){
    //Convierto la respuesta en JSON.
                let datosContacto = JSON.parse(this.responseText);
                    if (datosContacto["resultado"] == false){
                    document.getElementById('tabla-contactos').innerHTML = '<p>No hay contactos disponibles.</p>';
                    document.getElementById('formularioCreate').style.display = "none";
                        console.log("No se obtienen contactos");          
                    } else if (datosContacto["resultado"] == true){

                    //Almaceno los datos en una variable.
                        let InfoTabla = datosContacto["datosContacto"];
                        let tablaHTML ='';

                    //Se crea el filtro.
                        tablaHTML += '<div class="caja2" id="caja2">';
                        tablaHTML += '<input type="text" id="buscarNombre" placeholder="Buscar Contacto">';
                        tablaHTML += '</div>';
                        tablaHTML += '<p id="mensajeNoEncontrado"></p>';
                        
                    //Se  crea la tabla.
                        tablaHTML += '<table class= "mostrarDatos">';
                        tablaHTML += '<thead><tr>';
                        tablaHTML += '<th>Nombre</th>';
                        tablaHTML += '<th>Télefono</th>';
                        tablaHTML += '<th>Email</th>';
                        tablaHTML += '<th colspan="2">Acciones</th>';
                        tablaHTML += '</tr></thead>';
                        tablaHTML += '<tbody>';

                    //Recorre los datos y los imprime.
                        InfoTabla.forEach(function(contacto){
                            tablaHTML += '<tr>';
                            tablaHTML += '<td><a href="#" onclick="return contacto.verContacto(' + contacto.id + ')">' + contacto.nombre + '</a></td>';
                            tablaHTML += '<td>' + contacto.telefono + '</td>';
                            tablaHTML += '<td>' + contacto.email + '</td>';
                           
                    //Se crean los botones de Editar y Eliminar.        
                            tablaHTML += '<td><button class="botonEditar" onclick="return contacto.editContacto(' + contacto.id +')">Editar</button></td>'
                            tablaHTML += '<td><button class="botonEliminar" onclick="return contacto.deleteContacto(' + contacto.id + ')">Eliminar</button></td>';
                            tablaHTML += '</tr>';
                            
                        })

                        tablaHTML += '</tbody></table>';

                    //Muestro la tabla.
                        document.getElementById('tabla-contactos').innerHTML = tablaHTML;
                        document.getElementById('tabla-contactos').style.display = "block";
                        document.getElementById('formularioCreate').style.display = "none";

                    //Llamo a la funcion.
                        contacto.filtrarPorNombre();
                    };
            };
        };

        //Configurar la petición GET a PHP y obtenerlo.
        xhttp.open("GET", "EJFS1.php?accion=readInfoContacto", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();

        //Evita que nose recarge al enviar.
        return false;
    };


    filtrarPorNombre() {
    //Creado anteriormente el input.
        const input = document.getElementById('buscarNombre');
    //Mensaje.
        const mensaje = document.getElementById('mensajeNoEncontrado');
    //Escucha el evento.
        input.addEventListener('keyup', function() {
    //Obtengo el valor del input y lo convierto a minisculas.
            const filtro = this.value.toLowerCase();
    //Selecciono todas las filas donde se muestran los datos
            const filas = document.querySelectorAll('.mostrarDatos tbody tr');
    //Contador para comprobar si hay algun contacto.
            let coincidencias = 0;
    //Buscar por nombre y teléfono.
            filas.forEach(fila => {
                const nombre = fila.cells[0].textContent.toLowerCase();
                const telefono = fila.cells[1].textContent.toLowerCase();
            //Si hay alguno de los dos, pues que me muestre todo los que haya.
                if (nombre.includes(filtro) || telefono.includes(filtro)) {
                    fila.style.display = '';
                    coincidencias++;
                } else {
            //En el caso contrario, no me muestra nda.
                    fila.style.display = 'none';
                }
            });

            //Mensaje.
            if (filtro !== '' && coincidencias === 0) {
                mensaje.textContent = 'No existe ningún contacto con ese nombre o teléfono.';
                mensaje.style.display = 'block';
            } else {
                mensaje.style.display = 'none';
            }
        });
    }

    //Petición asincrona (AJAX).
    verContacto(id){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function(){
    //Se comprueba si la petición se completo.
            if(this.readyState == 4 && this.status == 200){
            //Convierto la respuesta en JSON.
                let resultado = JSON.parse(this.responseText);
                if(resultado["resultado"] == true){
                //Muestra la informacíon.
                    let c = resultado["datosContacto"];
                    alert("Nombre: " + c.nombre + "\nTeléfono: " + c.telefono + "\nEmail: " + c.email);
                } else {
                    console.log("No se pudo obtener el contacto");
                };
            };
        };

        //Configurar la petición GET a PHP y obtenerlo.
        xhttp.open("GET", "EJFS1.php?accion=editContacto&id=" + id, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();

        //Evita que nose recarge al enviar.
        return false;
    };

    //Petición asincrona (AJAX).
    editContacto(id){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function () {
    //Se comprueba si la petición se completo.
            if (this.readyState == 4 && this.status == 200) {
            //Convierto la respuesta en JSON.
                let resultado = JSON.parse(this.responseText);      
                if (resultado["resultado"] == true){
                    let InfoTabla = resultado["datosContacto"];
                    document.getElementById("formularioEdit").style.display = "block";
                    
                    //Obtengo los datos del contacto que voy a editar.
                    document.getElementById("id_contacto").value = InfoTabla.id;
                    document.getElementById("nombreContactoEdit").value = InfoTabla.nombre;
                    document.getElementById("telefonoContactoEdit").value = InfoTabla.telefono;
                    document.getElementById("emailContactoEdit").value = InfoTabla.email;

                    document.getElementById('formularioCreate').style.display = "none";
                    document.getElementById('tabla-contactos').style.display = "none";
                }else{
                    console.log("Ha salido error.")
                };
            };
        };

        //Configurar la petición GET a PHP y obtenerlo.
        xhttp.open("GET", "EJFS1.php?accion=editContacto&id=" + id, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();

        //Evita que nose recarge al enviar.
        return false;
    };

    //Petición asincrona (AJAX).
    updateContacto(){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function () {
    //Se comprueba si la petición se completo.
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("formularioEdit").style.display = "none";
                //Convierto la respuesta en JSON.
                let resultado = JSON.parse(this.responseText);      
                if (resultado["resultado"] == true) {
                    console.log("contacto modificado"); 
                    contacto.readInfoContacto();   
                } else if (resultado["resultado"] == false){
                    console.log("contacto no modificado");               
                };
            };
        };

        //Edito los datos que yo quiera.
        let idContactoUpdate = document.getElementById("id_contacto").value;
        let nombreContactoUpdate = document.getElementById("nombreContactoEdit").value;
        let telefonoContactoUpdate = document.getElementById("telefonoContactoEdit").value;
        let emailContactoUpdate = document.getElementById("emailContactoEdit").value;

        //Se preparan los parametros para enviar.
        let params = "id_contacto=" + idContactoUpdate + "&nombreContactoEdit=" + nombreContactoUpdate + 
        "&telefonoContactoEdit=" + telefonoContactoUpdate + "&emailContactoEdit=" + emailContactoUpdate;

        //Configurar la petición POST a PHP y enviarla.
        xhttp.open("POST", "EJFS1.php?accion=updateContacto", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        
        //Evita que nose recarge al enviar.
        return false; 
    };

    //Petición asincrona (AJAX).
    deleteContacto(id){
    //Comunicación con el servidor.
        let xhttp = new XMLHttpRequest();
    //Cambia el estado de la petción.
        xhttp.onreadystatechange = function () {
    //Se comprueba si la petición se completo.
            if (this.readyState == 4 && this.status == 200) {
    //Convierto la respuesta en JSON.
                let resultado = JSON.parse(this.responseText);
                if (resultado["resultado"] == false) {
                    console.log("Contacto no eliminado"); 
                    contacto.readInfoContacto(); 
                } else if (resultado["resultado"] == true){
                    console.log("Contacto eliminado"); 
                    contacto.readInfoContacto(); 
                    alert("Ya no existe este contacto.")
                };
            };
        };

        //Configurar la petición DELETE a PHP, con el id del contacto.
        xhttp.open("DELETE", "EJFS1.php?accion=deleteContacto&id=" + id, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();

        //Evita que nose recarge al enviar.
        return false; 
    };


    //Validaciones del formulario.
    validacionesFormulario() {
        let error = false;

        let nombreVal = document.formularioCreate.nombre.value;
        if(nombreVal === "" || !/^[a-zA-Z\s]+$/.test(nombreVal)) {
            this.printError("nombreVal", "Introduzca un nombre válido.");
            error = true;
        } else {
            this.printError("nombreVal", "");
        };

        let telefonoVal = document.formularioCreate.telefono.value;
        if(telefonoVal === "" || !/^\+?\d{5,14}$/.test(telefonoVal)) {
            this.printError("telefonoVal", "Introduzca un teléfono válido.");
            error = true;
        } else {
            this.printError("telefonoVal", "");
        };

        let emailVal = document.formularioCreate.email.value;
        if(emailVal === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            this.printError("emailVal", "Introduzca un email válido.");
            error = true;
        } else {
            this.printError("emailVal", "");
        };

        return !error; 
    }; 
    

    //Validaciones del formulario Edit.
    validacionesFormularioEdit() {

        let error = false;

        let nombreEditVal = document.formularioEdit.nombreContactoEdit.value;
        if(nombreEditVal === "" || !/^[a-zA-Z\s]+$/.test(nombreEditVal)) {
            this.printError("nombreEditVal", "Introduzca un nombre válido.");
            error = true;
        } else {
            this.printError("nombreEditVal", "");
        };

        let telefonoEditVal = document.formularioEdit.telefonoContactoEdit.value;
        if(telefonoEditVal === "" || !/^\+?\d{5,14}$/.test(telefonoEditVal)) {
            this.printError("telefonoEditVal", "Introduzca un teléfono válido.");
            error = true;
        } else {
            this.printError("telefonoEditVal", "");
        };

        let emailEditVal = document.formularioEdit.emailContactoEdit.value;
        if(emailEditVal === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEditVal)) {
            this.printError("emailEditVal", "Introduzca un email válido.");
            error = true;
        } else {
            this.printError("emailEditVal", "");
        };

        return !error; 
    };

    //Imprime los errores.
    printError(elemId, hintMsg) {
        document.getElementById(elemId).innerHTML = hintMsg;
    };


    //Muestro el formulario editar y crear.
    mostrarFormulario() {
        const formEdit = document.getElementById('formularioEdit');
        const formCreate = document.getElementById('formularioCreate');
        const tabla = document.getElementById('tabla-contactos');

        if (formEdit.style.display === "block") {
            alert("Estás editando un contacto. Termina o cancela la edición antes de crear uno nuevo.");
            return false; 
        }

        formCreate.style.display = "block";
        tabla.style.display = "none";
    }

}

//Instancia de la clase Contacto.
let contacto = new Contacto();

//Carga el DOM y muestra la tabla.
document.addEventListener("DOMContentLoaded", function() {
    contacto.readInfoContacto();
});