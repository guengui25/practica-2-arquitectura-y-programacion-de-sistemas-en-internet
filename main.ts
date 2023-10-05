const main = () => {

    console.log("Bienvido al trivial de los quesitos");

    const n_jugadores: number = prompt("Introduzca el numero de jugadores");

    const nombres_jugadores: string[] = [];

    while(nombres_jugadores.length < n_jugadores){
        nombres_jugadores.push(prompt("Introduzca el nombre del jugador")||"Undefinded");
    }

    const n_preguntas: number = prompt("Introduzca el numero de preguntas");

    console.log("Bienvenidos",nombres_jugadores);

    

}

main();

const URL: string = "https://opentdb.com/api.php?amount=12&category=15&difficulty=medium&type=multiple"


const preguntas = fetch(URL) 
                    .then(res =>res.json()) //Primera promesa para obtener los datos y hacerlos JSON
                    .then(data => {                    //Segunda promesa donde trabajo con los datos
                    data.results.forEach((result: any) => {

                        console.log(result.question);
                        const resp_ale: string[] = [result.correct_answer,result.incorrect_answers];
                        

                        console.log(resp_ale.flat().sort(() => Math.random() - 0.5));
                        
                        const respuesta = prompt("Respuesta");
                        
                        if (respuesta=== result.correct_answer) console.log("Has acertado!!!")
                        else console.log("Has fallado")

                    });
                  }
                );

//.then hace promesas --> Try ... Catch ... usando internet
