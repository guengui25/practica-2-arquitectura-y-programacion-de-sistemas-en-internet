const URL: string = "https://opentdb.com/api.php?amount=12&category=15&difficulty=medium&type=multiple"

const preguntas = fetch(URL) 
                    .then(res =>res.json()) //Primera promesa para obtener los datos y hacerlos JSON
                    .then(data => {                    //Segunda promesa donde trabajo con los datos
                    data.results.forEach((result: any) => {

                        console.log(result.question);
                        const resp_ale: string[] = result.correct_answer+result.incorrect_answers;

                        const aleatorizar = resp_ale.sort(()=> Math.random() - 0.5) //Aleatorizando

                        console.log(aleatorizar);
                        
                        const respuesta = prompt("Respuesta");
                        
                        if (respuesta=== result.correct_answer) console.log("Has acertado!!!")
                        else console.log("Has fallado")

                    });
                  }
                );

//.then hace promesas --> Try ... Catch ... usando internet

console.log(preguntas);