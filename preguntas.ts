import { pregunta } from "./definicion.ts"; //Importo desde definiciones mis tipos

//Función asíncrona ya que es una llamada a una API
//Devuelve una promesa ya que es una función asíncrona

//Hago uso de la API https://opentdb.com/api_config.php?ref=apislist.com

const getPregunta = async (         n_preguntas: number,        //Creo uno que sea adaptable en un futuro y exporto la llamada a la API
                                    tipo: string,
                                    dificultad: string,
                                    categoria?: number,
                                    ):Promise<pregunta[]> => { 

    const BASE_URL = "https://opentdb.com/api.php?";

    //Hago la llamada a la API modular
    
    let URL = `${BASE_URL}amount=${n_preguntas}`;
    if(categoria != null)URL += `&category=${categoria}`;
    if(dificultad != null)URL += `&difficulty=${dificultad}`;
    if(tipo != null)URL += `&type=${tipo}`;

    const preguntas: pregunta[] = [];

    //SIEMPRE SON IGUALES SI SON EN JSON

    //Llamada a la API
    const data = await fetch (URL); //await ya que esperamos a que responda
    
    //Comprobamos si la API ha respondido correctamente
    if(data.status !== 200){            //El estado 200 es error
        throw new Error("Bad request");
    }

    //Extraemos el JSON
    const json = await data.json();

    json.results.forEach((e: { question: any; correct_answer: any; incorrect_answers: any; difficulty: any; category: any; }) => { //Me ha sugerido inferir los tipos
        const pregunta_aux:pregunta = { pregunta:e.question,
                                        respuesta_correcta:e.correct_answer,
                                        respuestas:e.incorrect_answers,
                                        dificultad:e.difficulty,
                                        categoria:e.category,
        }
        preguntas.push(pregunta_aux) //Agrego la pregunta al banco
    });

    return preguntas;
}

export default getPregunta;
