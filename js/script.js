var btnValidarCurp = document.getElementById("btnValidarCurp");
var btnValidarRfc = document.getElementById("btnValidarRfc");

var resultadoCurp = document.getElementById("resultadoCurp");
var resultadoRfc = document.getElementById("resultadoRfc");

var curpEsCorrecto = false;
var rfcEsCorrecto = false;

resultadoCurp.style.display = "none";
resultadoRfc.style.display = "none";

let estadoVisibleCurp = false;
let estadoVisibleRfc = false;

resultadoCurp.addEventListener("click", function () {
    if (estadoVisibleCurp) {
        resultadoCurp.style.overflow = "hidden";
        resultadoCurp.style.height = "32px";
        estadoVisibleCurp = false;
    } else {
        resultadoCurp.style.overflow = "visible";
        resultadoCurp.style.height = "auto";
        estadoVisibleCurp = true;
    }
});

resultadoRfc.addEventListener("click", function () {
    if (estadoVisibleRfc) {
        resultadoRfc.style.overflow = "hidden";
        resultadoRfc.style.height = "32px";
        estadoVisibleRfc = false;
    } else {
        resultadoRfc.style.overflow = "visible";
        resultadoRfc.style.height = "auto";
        estadoVisibleRfc = true;
    }
});

btnValidarRfc.addEventListener("click", function () {
    var rfc = document.getElementById("rfc").value;
    resultadoRfc.innerHTML = validarRFC(rfc);
    resultadoRfc.style.display = "block";

    if (rfcEsCorrecto) {
        resultadoRfc.style.backgroundColor = "transparent";
    } else {
        resultadoRfc.style.backgroundColor = "#ef2947";
    }
});

btnValidarCurp.addEventListener("click", function () {
    var curp = document.getElementById("curp").value;
    resultadoCurp.innerHTML = validarCURP(curp);
    resultadoCurp.style.display = "block";
    if (curpEsCorrecto) {
        resultadoCurp.style.backgroundColor = "transparent";
    } else {
        resultadoCurp.style.backgroundColor = "#ef2947";
    }
});


function validarCURP(curp) {
    curpEsCorrecto = false;
    // 1. VALIDAR LONGITUD
    if (curp.length !== 18) {
        return "La CURP debe tener 18 caracteres.";
    }

    // 2. VALIDAR SEXO
    var sexo = curp.charAt(10).toUpperCase();
    if (sexo !== 'H' && sexo !== 'M' && sexo != 'X') {
        return "Identificador de sexo es inválido.";
    }

    if (sexo == 'H') {
        sexo = "Hombre";
    } else if (sexo == 'M') {
        sexo = "Mujer";
    } else {
        sexo = "Otro";
    }

    // 3. VALIDAR ESTADO

    // Tabla Hash con los estados
    const estados = {
        "AS": "Aguascalientes",
        "BC": "Baja California",
        "BS": "Baja California Sur",
        "CC": "Campeche",
        "CL": "Coahuila",
        "CM": "Colima",
        "CS": "Chiapas",
        "CH": "Chihuahua",
        "DF": "Ciudad de México",
        "DG": "Durango",
        "GT": "Guanajuato",
        "GR": "Guerrero",
        "HG": "Hidalgo",
        "JC": "Jalisco",
        "MC": "México",
        "MN": "Michoacán",
        "MS": "Morelos",
        "NT": "Nayarit",
        "NL": "Nuevo León",
        "OC": "Oaxaca",
        "PL": "Puebla",
        "MX": "México",
        "CX": "Ciudad de México",
        "QT": "Querétaro",
        "QR": "Quintana Roo",
        "SP": "San Luis Potosí",
        "SL": "Sinaloa",
        "SR": "Sonora",
        "TC": "Tabasco",
        "TS": "Tamaulipas",
        "TL": "Tlaxcala",
        "VZ": "Veracruz",
        "YN": "Yucatán",
        "ZS": "Zacatecas"
    };

    // Substrae desde el indice 11 los siguientes 2 caracteres (11 y 12)
    const estado = curp.substr(11, 2).toUpperCase();

    // Si la tabla de hash no tiene el estado que se tomo del curp
    if (!estados[estado]) {
        return "Estado inválido"
    }

    // 4. VALIDAR FECHA

    // ^: Es el inicio de la cadena o string
    //\d: Coincide con cualquier numero (0-9)
    // +: Debe haber uno o mas numeros consecutivos
    // $: Final de la cadena

    const fecha = curp.substr(4, 6);
    const validarCadenaFecha = /^\d+$/.test(fecha);

    // Si validarCadenaFecha es false
    if (!validarCadenaFecha) {
        return "La fecha no debe contener letras"
    }

    var anio = parseInt(fecha.substr(0, 2));
    var mes = fecha.substr(2, 2);
    var dia = fecha.substr(4, 2);

    // Verificar si las fechas son validas
    if (anio < 0 || anio > 99 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
        return "La fecha es inválida";
    }

    // 5. VALIDAR PRIMEROS 4 DIGITOS

    // Substrae desde el indice 0 los siguientes 4 caracteres (0 - 3)
    const primerosCuatro = curp.substr(0, 4);
    if (!/^[A-Z]+$/.test(primerosCuatro)) {
        return "Los cuatro primeros dígitos deben ser letras.";
    }

    // 6.CALCULAR LA EDAD

    // Determina si es del 2000 o 1900
    const umbral = 23;
    if (anio >= umbral) {
        anio += 1900;
    } else {
        anio += 2000;
    }

    // Se crea la fecha de nacimiento
    // Los meses comienzan desde 0 en JS
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const fechaActual = new Date();

    // La resta de las fechas da milisegundos
    // 1000 milisegundos = 1 seg...etc
    const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365.25));

    curpEsCorrecto = true;
    // 7. VERIFICAR QUE COINCIDA
    if (document.getElementById("rfc").value.substr(0, 10) === curp.substr(0, 10)) {
        return "CURP válida <br/>" + "Edad: " + edad +
            " años <br/>Sexo: " + sexo + "<br/>Estado: " + estados[estado] +
            "<br/>Fecha de nacimiento: " + dia + "/" + mes + "/" + anio +
            "<br/>CURP y RFC coinciden";
    }

    // Si todas las validaciones pasan, la CURP es válida
    return "CURP válida <br/>" + "Edad: " + edad +
        " años <br/>Sexo: " + sexo + "<br/>Estado: " + estados[estado] +
        "<br/>Fecha de nacimiento: " + dia + "/" + mes + "/" + anio;
}

function validarRFC(rfc) {
    rfcEsCorrecto = false;

    // 1. VALIDAR LONGITUD
    if (rfc.length !== 13) {
        return "El RFC debe tener 13 caracteres.";
    }

    // 2. VALIDAR FECHA
    // Substrae desde el indice 4 los siguientes 6 caracteres (4 - 9)
    const fecha = rfc.substr(4, 6);
    const validarCadenaFecha = /^\d+$/.test(fecha);

    if (!validarCadenaFecha) {
        return "La fecha no debe contener letras"
    }

    var anio = parseInt(fecha.substr(0, 2));
    var mes = fecha.substr(2, 2);
    var dia = fecha.substr(4, 2);

    // Verificar si las fechas son validas
    if (anio < 0 || anio > 99 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
        return "La fecha es inválida";
    }

    // 3. VALIDAR 4 PRIMEROS DIGITOS

    // ^: Es el inicio de la cadena o string
    // [A-Z]: Debe tener solo letras de la A a la Z
    // +: Debe haber uno o mas caracteres consecutivos
    // $: Final de la cadena

    const primerosCuatro = rfc.substr(0, 4);
    if (!/^[A-Z]+$/.test(primerosCuatro)) {
        return "Los primeros cuatro dígitos deben ser letras.";
    }

    // 4. CALCULAR EDAD

    // Se crea la fecha de nacimiento
    // Los meses comienzan desde 0 en JS
    // Solo se toman 2 numeros para el año por lo cual le sumamos 2000 
    // Determina si es del 2000 o 1900
    const umbral = 23;
    if (anio >= umbral) {
        anio += 1900;
    } else {
        anio += 2000;
    }
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const fechaActual = new Date();

    // La resta de las fechas da milisegundos por lo cual se divide entre
    // 1000 milisegundos = 1 seg...etc
    const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365.25));

    rfcEsCorrecto = true;
    // 7. VERIFICAR QUE COINCIDA
    if (rfc.substr(0, 10) === document.getElementById("curp").value.substr(0, 10)) {
        return "RFC válido <br/>" + "Edad: " + edad +
            " años <br/>Fecha de nacimiento: " + dia + "/" + mes + "/" + anio +
            " <br/>CURP y RFC coinciden";
    }

    // Si todas las validaciones pasan, la CURP es válida
    return "RFC válido <br/>" + "Edad: " + edad +
        " años <br/>Fecha de nacimiento: " + dia + "/" + mes + "/" + anio;
}

// LETRAS DE INPUT A UPPER CASE 
const inputRfc = document.getElementById("rfc");
const inputCurp = document.getElementById("curp");

// Se dispara cada que el contenido del input cambia 
inputRfc.addEventListener("input", function () {
    // Se obtiene el valor del input en mayusculas
    inputRfc.value = inputRfc.value.toUpperCase();
});

// Se dispara cada que el contenido del input cambia 
inputCurp.addEventListener("input", function () {
    // Se obtiene el valor del input en mayusculas
    inputCurp.value = inputCurp.value.toUpperCase();
});