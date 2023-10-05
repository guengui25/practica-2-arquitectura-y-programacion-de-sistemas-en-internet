# Práctica 2 - Quesitos Everywhere

## Utilizando el api del url se debe crear un juego del trivia para consola.

https://opentdb.com/api_config.php?ref=apislist.com

Los pasos del juego serán los siguientes, antes de comenzar se indicará:

- Número de jugadores
- Nombre de cada jugador
- Número de preguntas por jugador (no total)

(Ayuda sobre recoger información de terminal https://examples.deno.land/prompts )

Una vez introducidos todos los jugadores empezará el juego. 

El juego avanzará de la siguiente manera.
Según el órden en que se registraron los participantes recibirán una pregunta con sus posibles respuestas. 

Para responder a la pregunta el jugador introducirá un número en consola indicando la respuesta, en caso booleano será 1, verdadero y 2, falso. (La respuesta correcta nunca se debe mostrar en la misma posición)


Tras haber escrito la respuesta se le indicará si es correcto o no y se pasará al siguiente jugador. Así hasta terminar el juego e indicar el ganador con mayor número de aciertos (o varios en caso de empate).

Una vez terminado el juego se guardará en mongo un dato sobre cada usuario con su número total de aciertos y errores.

Desde el momento en que existan jugadores en la colección de mongo al iniciar el juego saldrá una tabla resumen con todos los jugadores anteriores y sus estadísticas.

## Puntos extra:
- Las categorías de cada pregunta no se deberán repetir siempre que haya menos preguntas que posibles categorías.
- Opción de dificultad de las preguntas para cada jugador.
- Guardar en mongo las preguntas erróneas de cada jugador
- Dar opción a ver las preguntas erróneas del jugador al introducir su nombre si ya existen en la colección