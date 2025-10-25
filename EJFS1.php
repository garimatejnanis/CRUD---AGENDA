<?php
require 'EJFSbd.php';

//Se crea la clase.
class Contacto {

    private $conexionBD;

    //Crear una conexion de Base de Datos.
    public function __construct() { 
        $configuracion = new BaseDatos(dirname(__FILE__) . "/configuracion.xml", dirname(__FILE__) . "/configuracion.xsd");
        $this->conexionBD = $configuracion->conectarBD();
    } 


    public function createContacto(){
        //Compruebo si hay algun contacto que existe y no lo añade.
         if (isset($_POST['nombre'], $_POST['telefono'], $_POST['email'])) {
            $nombre = trim($_POST['nombre']);
            $telefono = trim($_POST['telefono']);
            $email = trim($_POST['email']);

            $sqlCheck =$this->conexionBD->prepare("SELECT * FROM qwerty_datos WHERE nombre = ? OR telefono = ? OR email = ?");
            $sqlCheck->execute([$nombre, $telefono, $email]);

            //Contador y mensaje.
            if ($sqlCheck->rowCount() > 0) {
                echo json_encode(array("resultado" => false, "mensaje" => "Ya existe un contacto con este nombre, teléfono o email."));
            
            }else{

            //Datos del formulario desde HTML que se reciben.
                if (isset($_POST['nombre'], $_POST['telefono'], $_POST['email'])){
                    $nombre = $_POST['nombre'];
                    $telefono = $_POST['telefono'];
                    $email = $_POST['email'];

                //Se insertan los datos en la BD.
                    $sql = $this->conexionBD->prepare("INSERT INTO qwerty_datos(nombre, telefono, email) VALUES (?, ?, ?)");
                //Se ejecuta. 
                    $resultados = $sql->execute([$nombre, $telefono, $email]);
                
                //Si todo es correcto es true y no hay algo correcto false.
                    if ($resultados) {  
                        echo json_encode(array("resultado" => true));
                    } else {
                        echo json_encode(array("resultado" => false)); 
                    }
                
                }else{
                    echo "Error al introducir los datos";
                }
            }
        }

    }


    public function readInfoContacto(){
    //Obtengo los datos de la tabla.
        $sql = $this->conexionBD->prepare("SELECT * FROM qwerty_datos");
    //Se ejecuta.
        $resultados = $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    //Si todo es correcto es true y no hay algo correcto false.
        if(!$resultados){
            echo json_encode(array("resultado" => false));
        }else{
            echo json_encode(array("resultado" => true, "datosContacto" => $resultados));
        }
    }


    public function editContacto($id){
    //Obtengo los datos para poder mostrarme en el formulario de Edit.
        $sql = $this->conexionBD->prepare("SELECT * FROM qwerty_datos WHERE id = ?");    
    //Se ejecuta
        $sql->execute([$id]);
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
    
        //Si todo es correcto es true y no hay algo correcto false.
        if(!$resultados){
            echo json_encode(array("resultado" => false));
        }else{
            echo json_encode(array("resultado" => true, "datosContacto" => $resultados));
        }
    }

    public function updateContacto(){
    //Datos del formulario desde HTML que se reciben
        if (isset($_POST['id_contacto'], $_POST['nombreContactoEdit'], $_POST['telefonoContactoEdit'], $_POST['emailContactoEdit'])){
            
            $id = $_POST['id_contacto'];
            $nombre = $_POST['nombreContactoEdit'];
            $telefono = $_POST['telefonoContactoEdit'];
            $email = $_POST['emailContactoEdit'];

        //Se insertan los datos en la BD.        
            $sql = $this->conexionBD->prepare(" UPDATE qwerty_datos SET nombre = ?, telefono = ?, email = ? WHERE id = ?");
            $resultados = $sql->execute([$nombre, $telefono, $email, $id]);
        
        //Si todo es correcto es true y no hay algo correcto false.
            if(!$resultados){
                echo json_encode(array("resultado" => false));
            }else{
                echo json_encode(array("resultado" => true));
            }
        }
    }

    public function deleteContacto($id){
    //Eliminar la entrada por el id.
        $sql = $this->conexionBD->prepare("DELETE FROM qwerty_datos WHERE id = ?");
        $resultados = $sql->execute([$id]);

    //Si todo es correcto es true y no hay algo correcto false.
        if(!$resultados){
            echo json_encode(array("resultado" => false));
        }else{
            echo json_encode(array("resultado" => true));
        }
    }

    //Validaciones del formulario.
    public function validacionesFormulario(){

        $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
        $nombreVal = true;

        if (empty($nombre)) {
            $this->printError("nombreVal", "Introduzca el nombre.");
        } else {
            $regex = '/^[a-zA-Z\s]+$/';

            if (!preg_match($regex, $nombre)) {
                $this->printError("nombreVal", "Introduzca un nombre válidos.");
            } else {
                $this->printError("nombreVal","");
                $nombreVal = false;
            }
        }

        $telefono = isset($_POST['telefono']) ? $_POST['telefono'] : '';
        $telefonoVal = true;

        if (empty($telefono)) {
            $this->printError("telefonoVal", "Introduzca el teléfono.");
        } else {
           
            $regex = '/^[1-9]{5,14}$/';

            if (!preg_match($regex, $telefono)) {
                $this->printError("telefonoVal", "Introduzca un teléfono válido.");
            } else {
                $this->printError("telefonoVal", "");
                $telefonoVal = false; 
            }
        }

        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $emailVal = true;

        if (empty($email)) {
            $this->printError("emailVal", "Introduzca el email.");
        } else {

            $regex = '/^[\w\.\-]+@[a-zA-Z\d\-]+\.[a-zA-Z]{2,}$/';

            if (!preg_match($regex, $email)) {
                $this->printError("emailVal", "Introduzca un email válido.");
            } else {
                $this->printError("emailVal", "");
                $emailVal = false; 
            }
        }

        return $nombrePersonaVal && $telefonoVal && $emailVal;
    }


    //Validaciones del formulario Edit.
    public function validacionesFormularioEdit(){

        $nombreEdit = isset($_POST['nombreContactoEdit']) ? $_POST['nombreContactoEdit'] : '';
        $nombreEditVal = true;

        if (empty($nombreEdit)) {
            $this->printError("nombreEditVal", "Introduzca el nombre.");
        } else {
            $regex = '/^[a-zA-Z\s]+$/';

            if (!preg_match($regex, $nombreEdit)) {
                $this->printError("nombreEditVal", "Introduzca un nombre válido.");
            } else {
                $this->printError("nombreEditVal","");
                $nombreEditVal = false;
            }
        }

        $telefonoEdit = isset($_POST['telefonoContactoEdit']) ? $_POST['telefonoContactoEdit'] : '';
        $telefonoEditVal = true;

        if (empty($telefonoEdit)) {
            $this->printError("telefonoEditVal", "Introduzca el teléfono.");
        } else {
           
            $regex = '/^[1-9]{5,14}$/';

            if (!preg_match($regex, $telefonoEdit)) {
                $this->printError("telefonoEditVal", "Introduzca un teléfono válido.");
            } else {
                $this->printError("telefonoEditVal", "");
                $telefonoEditVal = false; 
            }
        }

        $emailEdit = isset($_POST['emailEdit']) ? $_POST['emailEdit'] : '';
        $emailEditVal = true;

        if (empty($emailEdit)) {
            $this->printError("emailEditVal", "Introduzca el email.");
        } else {

            $regex = '/^[\w\.\-]+@[a-zA-Z\d\-]+\.[a-zA-Z]{2,}$/';

            if (!preg_match($regex, $email)) {
                $this->printError("emailEditVal", "Introduzca un email válido.");
            } else {
                $this->printError("emailEditVal", "");
                $emailEditVal = false; 
            }
        }

        return $nombrePersonaVal && $telefonoVal && $emailVal;
    }


    //Imprime los errores.
    public function printError($hintMsg, $elemId) {
        if (!empty($hintMsg)) {
            echo $elemId . "\n"; 
        }
    }
}

//Instancio la clase.
$contacto = new Contacto(); 

//Genero accion para poder hacer peticiones ya que son varios metodos.
//Esto funciona si la accion es igual al nombre llama al metodo.
if (isset($_GET['accion'])){
    $accion = $_GET['accion'];

    if ($accion == 'createContacto'){
        $contacto->createContacto();
    }else if($accion == 'readInfoContacto'){
        $contacto->readInfoContacto();
    }else if ($accion == 'editContacto'){
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $contacto->editContacto($id);
        } else {
            echo json_encode(array("resultado" => false, "mensaje" => "No se proporcionó el parámetro 'id'"));
        }
    }else if ($accion == 'updateContacto'){
        $contacto->updateContacto();
    } else if ($accion == 'deleteContacto'){
        if (isset($_GET['id'])) {    
            $id = $_GET['id'];    
            $contacto->deleteContacto($id);
        } else {
            echo json_encode(array("resultado" => false, "mensaje" => "No se proporcionó el parámetro 'id'"));
        }
    }else{
        $contacto->validacionesFormulario();
        $contacto->validacionesFormularioEdit();
    }
}

?>