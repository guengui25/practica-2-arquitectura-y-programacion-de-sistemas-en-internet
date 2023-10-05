//Creo el tipo jugador (tipo para almacenar en MONGO DB)
interface jugador { nombre:string, 
                    aciertos:number, 
                    errores:number
}

//Creo el tipo pregunta (No es necesario, pero lo uso para limpieza propia y entendimiento)
interface pregunta{ pregunta:string,
                    respuesta_correcta:boolean,
                    dificultad:string,
                    categoria:string,
                    contestada_por?:jugador,
                    resultado?:boolean
}

//Creo el tipo partida
interface partida { n_jugadores:number, 
                    jugadores:jugador[] ,
                    n_preguntas:number,
                    preguntas:any[],
                    preguntas_realizadas?:any[]
}


//Función que inicializa la partida
const inicializar = (): partida => {

    console.log("|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>");
    console.log("       Bienvido al trivial (el juego de los quesitos)         ");
    console.log("|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>");

    const partida:partida = {n_jugadores:0,jugadores:[],n_preguntas:0,preguntas:[]}  //Creo la partida
    
    let temp:number = 0;
    let check:boolean = false;

    //Pido el numero de jugadores, si es 0 o introduce una cadena de texto, lo pido hasta que introduzca algo válido
    do{
        temp = parseInt(prompt("Introduzca el numero de jugadores \n")||"0");          //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt

        if (!isNaN(temp) && temp > 0) check = true;
        else console.log("Error: Introduce un numero valido de jugadores (minimo 1) \n")
    }
    while (!check)

    //Lo meto en la partida
    partida.n_jugadores = temp;

    //Reinicio los valores tras su uso
    temp = 0;
    check = false;

    //Creo el string[] para almacenar los nombres de los jugadores
    const nombres_jugadores: string[] = [];

    do{
        while(nombres_jugadores.length < partida.n_jugadores){
            nombres_jugadores.push(prompt(`Introduzca el nombre del jugador ${nombres_jugadores.length + 1} \n`)||"undefined"); //Si no se pone el nombre se toma undefined
        }
        check = true; //Asumo que todos los jugadores han puesto su nombre correctamente
        nombres_jugadores.forEach(element => {
            if(element === "undefined"){
                check = false;
                nombres_jugadores.length = 0;   //Vacio el string[] ya que hay un nombre que no está bien definido              //https://es.stackoverflow.com/questions/103670/c%C3%B3mo-vaciar-un-array-en-javascript
                console.log("Error: Introduce un nombre valido para los jugadores \n")
            }
        });

    }
    while(!check)

    //Creo los jugadores
    nombres_jugadores.forEach(element => {
        const jugador = {nombre:element,aciertos:0,errores:0};
        partida.jugadores.push(jugador);
    });

    //Reinicio los valores tras su uso
    check = false;

    //Pido el numero de preguntas, si es 0 o introduce una cadena de texto, lo pido hasta que introduzca algo válido
    do{
        temp = parseInt(prompt("Introduzca el numero de preguntas \n")||"0");      //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt

        if (!isNaN(temp) && temp > 0) check = true;
        else console.log("Error: Introduce un numero valido de preguntas (minimo 1) \n")
    }
    while (!check);

    partida.n_preguntas = temp;

    //Reinicio los valores tras su uso
    temp = 0;
    check = false;



    console.log("Bienvenidos "+ partida.jugadores.map(element =>element.nombre).join(", ")             //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    + " vais a responder",partida.n_preguntas,"preguntas cada uno.\n");

    return partida;
}

//Hago uso de la API https://opentdb.com/api_config.php?ref=apislist.com

const jugar_preguntas = (partida:partida,URL:string) => {

    fetch(URL)  //.then hace promesas --> Try ... Catch ... usando internet
    .then(res =>res.json()) //Primera promesa para obtener los datos y hacerlos JSON    
    .then(data => {         //Segunda promesa donde trabajo con los datos     
    data.results.forEach(e => {
        const pregunta_aux:pregunta = { pregunta:e.question,
                                        respuesta_correcta:e.correct_answer,
                                        dificultad:e.difficulty,
                                        categoria:e.category,
        }
        
        partida.preguntas.push(pregunta_aux) //Agrego la pregunta al "banco local"
    });

    //console.log(partida);

    jugar(partida);


    }
);};

const pregunta = (partida:partida,jugador:jugador) => {
    console.log("Es el turno de",jugador.nombre,"\n")
    
        console.log(partida.preguntas[0].pregunta, "(Responde con el numero al lado de la opcion)");    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
    
        console.log("1. True ")
        console.log("2. False ")
        
        
        let respuesta: number|string = 0;
        let contestado: boolean = false;
    
        do{
            respuesta = parseInt(prompt("Respuesta:")||"0");          //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    
            if (!isNaN(respuesta) && (respuesta === 1 || respuesta === 2)) contestado = true;
            else console.log("Error: Introduce una respuesta valida \n")
        }
        while (!contestado)
    
    
        if(respuesta === 1){respuesta = "True"}
        else {respuesta = "False"}
    
        if (respuesta === partida.preguntas[0].respuesta_correcta){console.log("Has acertado!!!"); jugador.aciertos=+1} 
        else {console.log("Has fallado, la respuesta correcta era: ",partida.preguntas[0].respuesta_correcta);jugador.errores=+1;}
       
     
    partida.preguntas_realizadas?.push(partida.preguntas[0]) //Lo muevo a la lista de preguntas realizadas
    partida.preguntas.shift(); //Elimino la pregunta ya realizada de la lista de posibilidades
}

const jugar = (partida:partida) => {
    for(let i: number = 0; i < partida.n_preguntas;++i){
        partida.jugadores.forEach(jugador => {
                console.log("|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> \n");
                pregunta(partida,jugador);
        });
    }

    finalizar_partida(partida);
}

const finalizar_partida = (partida:partida) => {

    const puntuacion_max = partida.jugadores.reduce((acc,elem) => {
        if (acc<elem.aciertos) return acc=elem.aciertos;
        else return acc
    },0)

    console.log("El ganador/es con",puntuacion_max," aciertos es/son: ")
    const ganadores = partida.jugadores.filter(e=>e.aciertos === puntuacion_max).forEach(e=>console.log(e.nombre));

}


//===============================================================
//https://www.mongodb.com/developer/languages/rust/getting-started-deno-mongodb/





//===============================================================

//Main del codigo, se inicializa la partida y luego se llama a la función que trabaja con la promesa
const main = () => {

    const URL: string[] = ["https://opentdb.com/api.php?amount=","1","&type=","boolean"]

    const partida:partida = inicializar();
    
    URL[1] = String(partida.n_preguntas*partida.n_jugadores);

    const URL_completa:string = URL.join("");

    jugar_preguntas(partida,URL_completa);
}

main();


/*Codigo para respuesta multiple y múltiples solicitudes seguidas (Manera simplificada)


const solicitar_preguntas = (jugador:jugador,URL:string) => fetch(URL) 
    .then(res =>res.json()) //Primera promesa para obtener los datos y hacerlos JSON    //.then hace promesas --> Try ... Catch ... usando internet
    .then(data => {                    //Segunda promesa donde trabajo con los datos
        
        console.log("Es el turno de",jugador.nombre)

        data.results.forEach((result: any) => {

        console.log(result.question);
        const resp_ale: string[] = [result.correct_answer,result.incorrect_answers];


        console.log(resp_ale.flat().sort(() => Math.random() - 0.5)); //Desordeno la respuesta correcta

        const respuesta = prompt("Respuesta: ");

        if (respuesta=== result.correct_answer){console.log("Has acertado!!!"); jugador.aciertos=+1} 
        else {console.log("Has fallado, la respuesta correcta era: ",result.correct_answer);jugador.errores=+1; }
                });
            }
        );
*/
