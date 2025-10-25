/*Crea la BD si no existe con este nombre.*/
CREATE DATABASE if NOT EXISTS qwerty_agenda;

/*Se usa la BD, para poder crear la tabla*/
USE qwerty_agenda;

/*Se crea la tabla, con sus campos*/
CREATE TABLE if NOT EXISTS qwerty_datos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
/*Comprueba si el telefono esta entre los numeros.*/
    CHECK (CHAR_LENGTH(telefono) BETWEEN 6 AND 15)
);

/*Inserta los datos.*/
INSERT INTO qwerty_datos(nombre, telefono, email) VALUES
    ('Garima', '666111222', 'garimatejnani@gmail.com'),
    ('Alias', '0034632178954', 'alias2025@hotmail.es');

/*Se añade restriccion, eso evita los duplicados.*/
ALTER TABLE qwerty_datos ADD UNIQUE (nombre, telefono, email);