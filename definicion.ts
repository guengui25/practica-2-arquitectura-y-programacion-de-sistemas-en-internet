//Defino los tipos de mi juego de quesitos

//Creo el tipo jugador (tipo para almacenar en MONGO DB - Al final no es necesario)
export interface jugador {
    nombre:string, 
    aciertos:number, 
    errores:number,
    dificultad:string,
    preguntas?:pregunta[] //El jugador se crea sin preguntas asignadas
};

//Creo el tipo partida
export interface partida { 
    n_jugadores:number, 
    jugadores:jugador[] ,
    n_preguntas:number
};

//Creo el tipo pregunta (No es necesario, pero lo uso para limpieza propia y entendimiento)
export interface pregunta { 
    pregunta:string,
    respuesta_correcta:string,
    respuestas:string,
    dificultad:string,
    categoria:string,
    resultado?:boolean //Si ha respondido bien o mal
};