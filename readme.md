{
  "sessionId": "6a18f52aa08f9a781cd98ec0",
  "userId": "48100",
  "message": "string"
}

Tengo este proyecto nestjs

para este proyecto quiero querar una especie de agente.
mi intension es que un usuario escriba un mensaje como por api.

ejemplo de mensajes:
el cliente chedraui no salen sus envios
el cliente 49888 no puede hacer envios
el cliente no puede enviar plantillas de carousel
el cliente no puede enviar plantillas de authenticacion pero si plantillas texto

hay muchas otras preguntas vale con diferentes temas relacionados a mis productos.
para este caso estariamos hablando de mi producto "portal auronix"
yo como humano entiendo que hay problemas con x cliente para sus envios, entonces  lo que yo tengo que hacer

1 si no me dan el ID cliente pero si el nombre debo buscar el ID cliente a partir del nombre por una api
2 debemoos tambien identificar desde donde sale el envio, enviador portal, api envios v1, v2 o desde send el usuario debe responder
3 es importante saber que un clienmte  puede tener mas de 1 id cliente ejemplo chedraui mexico, chedraui japon etc.
5 es importante preguntar que id cliente es el que tiene el problema para poder ayudarlo
5 identificar que plantilla envio
6 despues se debe verificar por api si ese id tiene habilitado el "by pass" si la plantilla es de url dinamica o de carousel y si no esta habilitado entonces ese es el problema
7 si se envio por portal entonces debemos asegurarnos si la ff de gitlab esta en v1 o v2 si la plantilla es de carousel y esta en v1 entonces ese es el problema
8 si no es nada de esto y el usuario no me mando que campaña debo preguntar y consultar por api el estado de esa campaña.

ojo este agente debe ser capaz de entender diferentes formas de preguntar lo mismo, por ejemplo:
- "El cliente chedraui no puede enviar plantillas de carousel"
- "Chedraui tiene problemas para enviar plantillas de carousel"
- "No puedo enviar plantillas de carousel con el cliente chedraui"

tambien no solo respondera preguntas sobre envios seran muchos temas pero este sera el primer caso de uso.
este agente no tomara acciones tambien podra responder solo informativo, ejemplo

que requisitos debe cumplir un cliente para enviar plantillas de carousel
por que version de la api salen los envios del enviador para x cliente

estoy pensando en usar qdrant para mis vectores si es que son necesarios.