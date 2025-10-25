<?php

class BaseDatos {
    private $nombre;
    private $esquema;

    public function __construct($nombre, $esquema) {
        $this->nombre = $nombre;
        $this->esquema = $esquema;
    }

    public function leerXmlConfiguracion() {
        $config = new DOMDocument();
        $config->load($this->nombre);
        $res = $config->schemaValidate($this->esquema);
        if ($res === false) {
            throw new InvalidArgumentException("Revise fichero de configuración");
        }

        //Obtiene datos de la bd, para conectar
        $datos = simplexml_load_file($this->nombre);
        $ip = $datos->xpath("//ip");
        $puerto = $datos->xpath("//puerto");
        $nombre = $datos->xpath("//nombre");
        $usu = $datos->xpath("//usuario");
        $clave = $datos->xpath("//clave");

        $cadenaConexion = sprintf("mysql:dbname=%s;host=%s;port=%s", $nombre[0], $ip[0], $puerto[0]);

        $resul = [];
        $resul[] = $cadenaConexion;
        $resul[] = $usu[0];
        $resul[] = $clave[0];
        
        return $resul;
    }

    public function conectarBD() {
        $res = $this->leerXmlConfiguracion();
        $bd = new PDO($res[0], $res[1], $res[2]);
        return $bd;
    }
}


$configuracion = new BaseDatos(dirname(__FILE__) . "/configuracion.xml", dirname(__FILE__) . "/configuracion.xsd");
$conexionBD = $configuracion->conectarBD();

?>
