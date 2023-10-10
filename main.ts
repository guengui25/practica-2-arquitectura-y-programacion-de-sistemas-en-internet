import {jugador,partida,pregunta} from "./definicion.ts"; //Importo desde definiciones mis tipos

import getPregunta from "./preguntas.ts"; //Importo la llamada a la API

//Función que inicializa la partida
const inicializar = async (): Promise<partida> => {    //Inicializa cada jugador y crea la partida

    console.log("\n|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>\n",
                "       Bienvido al trivial (el juego de los quesitos)         ",
                "\n|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>");

    const partida:partida = {n_jugadores:0,jugadores:[],n_preguntas:0}  //Creo la partida
    
    //Como voy a ir variando su valor, tienen que ser variables
    let temp:number|string = 0;
    let check:boolean = false;

    //Pido el numero de jugadores, si es 0 o introduce una cadena de texto, lo pido hasta que introduzca algo válido
    do{
        temp = parseInt(prompt("Introduzca el numero de jugadores\n")||"0");          //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt

        if (!isNaN(temp) && temp > 0) check = true; //Si es un número y es > 0, permito ese nº de jugadores
        else console.log("Error: Introduce un numero valido de jugadores (minimo 1)\n")
    }
    while (!check)

    //Lo meto en la partida
    partida.n_jugadores = temp;

    //Reinicio los valores auxiliares tras su uso
    temp = "";
    check = false;

    do{
        check = true;

        temp = prompt(`Introduzca el nombre del jugador ${partida.jugadores.length + 1}\n`)||"undefined" ; //Si no se pone el nombre se toma undefined

        //Si temp es undefined, es decir, no ha introducido su nombre correctamente
        if(temp === "undefined"){

            console.log("Error: Introduce un nombre valido para los jugadores\n")
            check = false;
        }
        
        //Creo el jugador y lo agrego a la partida

        if(check){ //Si ha introducido el nombre bien
            const jugador = {nombre:temp,aciertos:0,errores:0,dificultad:""}; //Creo al jugador sin dificultad asignada
            partida.jugadores.push(jugador);
        }


    }
    while(partida.jugadores.length < partida.n_jugadores)

    //Reinicio los valores tras su uso
    temp = "";
    check = false;

    //Pido la dificultad para cada jugador
    partida.jugadores.forEach(element => {
        do{
            temp = parseInt(prompt(`Introduzca la dificultad para el jugador ${element.nombre}\n( 1 = facil , 2 = medio , 3 = dificil )\n`)||"0") ; //Si no se pone la dificultad se toma 0

            check = true;

            //Si temp es 0, es decir, no ha introducido la dificultad correctamente

            switch(temp){
                case 1:
                    element.dificultad = "easy";
                break;
                case 2:
                    element.dificultad = "medium";
                break;
                case 3:
                    element.dificultad = "hard";
                break;
                default:
                    console.log("Error: Introduce una opción valida para la dificultad\n")
                    check = false;
                break;
            }

        }while(!check)
    });


    //Reinicio los valores tras su uso
    temp = 0;
    check = false;

    //Pido el numero de preguntas, si es 0 o introduce una cadena de texto, lo pido hasta que introduzca algo válido
    do{
        temp = parseInt(prompt("Introduzca el numero de preguntas por jugador\n")||"0");      //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt

        if (!isNaN(temp) && temp > 0) check = true;
        else console.log("Error: Introduce un numero valido de preguntas (minimo 1)\n")
    }
    while (!check);

    partida.n_preguntas = temp;

    console.log("Recuperando preguntas de la API...\n");

    try{
        await rellenar_preguntas(partida); //Relleno las preguntas de cada jugador 
    }catch(e){
        throw("Error, no se pudieron recuperar las preguntas de la API"); //Devuelvo un status 500 (error fatal)
    }

    console.log("Se han recuperado las pregutnas de la API correctamente.\n\n");

    console.log("Bienvenidos "+partida.jugadores.map(element =>element.nombre).join(", ")             //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    + " vais a responder",partida.n_preguntas,"preguntas cada uno\n");

    return partida;
}

const jugar = (partida:partida) => {

    for(let i: number = 0; i < partida.n_preguntas;++i){    //Itero el número de preguntas que quieren jugar cada jugador
        partida.jugadores.forEach(jugador => {
                console.log("|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> \n");
                pregunta(jugador,i);
        });
    }

    finalizar_partida(partida);     //Cuando acaban, compruebo el resultado y doy el ganador
}

const pregunta = (jugador:jugador, n_pregunta:number) => {

    console.log("Es el turno de",jugador.nombre,"\n")
    
    if (jugador.preguntas) { //Si el jugador tiene preguntas
        console.log(jugador.preguntas[n_pregunta].pregunta, "(Responde con el numero de opcion)");

        const respuestas: string[] = [jugador.preguntas[n_pregunta].respuesta_correcta , jugador.preguntas[n_pregunta].respuestas].flat(); //Aplano el array de respuestas       
        
        //https://es.javascript.info/task/shuffle

        respuestas.sort(() => Math.random() - 0.5); //Barajo las respuestas

        console.log(respuestas); //Una vez barajadas

        //Quiero hacer que se obligue a responder con el número de la respuesta, y si se introduce algo no válido, se repita la pregunta, una vez se responda bien, se almacena el resultado 

        let respuesta: number = 0;
        let check: boolean = false;

        //Si es de opción múltiple

        if(respuestas.length > 2){
            do{
                respuesta = parseInt(prompt("Introduzca el numero de la respuesta\n")||"0");      //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    
                if (!isNaN(respuesta) && (respuesta === 1 || respuesta === 2 || respuesta === 3 || respuesta === 4)) check = true;
                else console.log("Error: Introduce una respuesta valida\n");
            }
            while (!check);
        }

        //Si es de verdadero/falso
        if(respuestas.length === 2){
            do{
                respuesta = parseInt(prompt("Introduzca el numero de la respuesta\n")||"0");      //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    
                if (!isNaN(respuesta) && (respuesta === 1 || respuesta === 2)) check = true;
                else console.log("Error: Introduce una respuesta valida\n")
            }
            while (!check);
        }

        //Compruebo si ha respondido correctamente
        if(respuestas[respuesta-1] === jugador.preguntas[n_pregunta].respuesta_correcta){ //Si la respuesta es correcta (respuesta-1 porque el array empieza en 0)
            console.log("Correcto!!!\n");

            jugador.preguntas[n_pregunta].resultado = true;

            jugador.aciertos++;
        }
        else{
            console.log("Incorrecto\nLa respuesta correcta era: ",jugador.preguntas[n_pregunta].respuesta_correcta,"\n");

            jugador.preguntas[n_pregunta].resultado = false;

            jugador.errores++;
        }

        jugador.preguntas[n_pregunta].resultado = respuestas[respuesta-1] === jugador.preguntas[n_pregunta].respuesta_correcta;

        //console.log("El resultado de la pregunta es",jugador.preguntas[n_pregunta].resultado,"\n");

        console.log(jugador.nombre,"llevas",jugador.aciertos,"aciertos y",jugador.errores,"errores \n");

    }
}

const finalizar_partida = (partida:partida) => {

    const puntuacion_max = partida.jugadores.reduce((acc,elem) => {
        if (acc<elem.aciertos) return acc=elem.aciertos;
        else return acc
    },0)

    console.log("|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>\n");

    console.log("El ganador/es con",puntuacion_max,"aciertos es/son: ")
    const ganadores = partida.jugadores.filter(e=>e.aciertos === puntuacion_max).forEach(e=>console.log(e.nombre));

    console.log("\n|> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |> |>\n");

}

const rellenar_preguntas = async (partida:partida) => {

    const categorias_preg: string[] = [ //Posición para solicitud +9
        "General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music",
        "Entertainment: Musicals & Theatres","Entertainment: Television","Entertainment: Video Games",
        "Entertainment: Board Games","Science & Nature","Science: Computers","Science: Mathematics",
        "Mythology","Sports","Geography","History","Politics","Art","Celebrities","Animals","Vehicles",
        "Entertainment: Comics","Science: Gadgets","Entertainment: Japanese Anime & Manga","Entertainment: Cartoon & Animations"
    ];    

    //Estaba usando foreach para recorrer un array, pero no se generaba correctamente ya que es síncrino y no se espera a que se termine de ejecutar 
    //el código de dentro del foreach para seguir con el código de fuera, por lo que no se generaba correctamente el array de preguntas de cada jugador

    //https://blog.fergv.com/js/asynchronous-foreach/#problema

    for(const jugador of partida.jugadores) { //Voy a rellenar de preguntas a cada jugador

        const preguntas = await getPregunta(partida.n_preguntas,"boolean",jugador.dificultad) //Pido las preguntas a la API

        if(partida.n_preguntas < categorias_preg.length){ //Las categorías de cada pregunta no se deberán repetir siempre que haya menos preguntas que posibles categorías.
            
            //Creo una lista de categorías que se han usado
            const categorias_usadas: string[] = [];

            //Recorro las preguntas
            preguntas.forEach(pregunta => {

                //Si la categoría no se ha usado
                if(!categorias_usadas.includes(pregunta.categoria)){
                    //La añado a la lista de categorías usadas
                    categorias_usadas.push(pregunta.categoria);
                }
                else{ //Si ya se ha usado
                    //Elimino la pregunta de la lista de preguntas
                    preguntas.splice(preguntas.indexOf(pregunta),1);
                }
            });

            while(preguntas.length < partida.n_preguntas){ //Mientras que no haya suficientes preguntas
            //Recorro las categorías
                for (const categoria of categorias_preg) {
                    if (!categorias_usadas.includes(categoria)) { //Si la categoría no se ha usado
                        const pregunta = await getPregunta(1, "boolean", jugador.dificultad, categorias_preg.indexOf(categoria) + 9); //Pido una pregunta de esa categoría a la API
                        preguntas.push(pregunta[0]); //Agrego la pregunta al banco de preguntas
                    }
                }
            }
        }
        jugador.preguntas = preguntas; //Asigno las preguntas al jugador
    }
}

const main = async () => {
    
    const partida = await inicializar(); //Se inicializa la partida

    jugar(partida); //Se juega la partida
}

main();