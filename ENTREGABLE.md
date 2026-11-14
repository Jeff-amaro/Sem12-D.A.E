# Entregable Lab 12 - Servicios web con React


## 1. Entorno y pruebas iniciales


- Node: v24.16.0
- npm: 11.13.0
- `npm install`: 183 paquetes
- `npm test` inicial: 67 pruebas, 46 fallan (api 14/14, cors 3/8, useExams 18/18, App 2/3, ExamList 9/10), 21 pasan.
- `npm test` final: 67/67 pasan.
- `npm run test:ai` final: 67/67 pasan.


## 2. Análisis de la red simulada y CORS


- `fakeNetwork.js`: adaptador de Axios que simula red (retardo, servidor apagado, fallos, CORS, modo manual).
- `fakeApi.js`: servidor API del curso (`GET/POST/DELETE /exams/`, validación de título).
- `lib/cors.js`: decisión CORS del navegador (`checkCors`).
- Las rutas terminan en `/` porque el contrato (DRF) exige barra final; sin ella → 404.
- Origen = esquema + host + puerto; `http://localhost:5173` y `http://localhost:8000` son distintos por el puerto.
- Con `allowedOrigins: []`, `checkCors` devuelve `not-listed`: el navegador bloquea toda petición ("Network Error", sin respuesta).


## 3. Tabla de pantalla (estados y errores)


| Situación | Estado UI | Error en pantalla |
|---|---|---|
| Al entrar (petición en vuelo) | Cargando | — |
| Respuesta OK | Lista con cuestionarios | — |
| Servidor apagado / CORS | Error | No se pudo conectar... servidor/CORS |
| Respuesta 500 | Error | La API falló (error 500) |
| Título vacío en alta | Listado sigue | actionError: Este campo no puede estar en blanco |
| Borrado fallido | Listado sigue | actionError con describeError |


Capturas: `docs/screens/01-loading.png`, `02-ready.png`, `03-error.png`, `04-500.png`, `05-empty-title.png`, `06-cors-blocked.png`.


## 4. Clasificación de los 5 fallos de `src/ai/`


| # | Archivo:Línea | Pruebas que lo detectan | Mensaje | Causa | Visible en navegador |
|---|---|---|---|---|---|
| 1 | `src/ai/useExams.js:14` (useEffect) | carrera/StrictMode (useExams) | respuesta vieja pisa a la nueva | sin AbortController ni flag `cancelled` | Sí: datos viejos tras reload rápido |
| 2 | `src/ai/useExams.js:21` (catch) | estados error (useExams) | status queda `ready` | error tragado, `console.error` | Sí: pantalla "funciona" sin datos |
| 3 | `src/ai/useExams.js:46` (create) | doble envío (useExams) | dos POST | sin guarda `useRef` | Sí: duplicados |
| 4 | `src/ai/useExams.js:38` (remove) | borrar (useExams) | fila sigue tras borrar | no filtra lista ni `actionError` | Sí: fila persiste |
| 5 | `src/ai/cors.js:2` | cors (cors) | origen `*` | comodín en CORS | No directo; falla cors-check (código 9) |


## 5. Uso de `examctl` (API en 127.0.0.1:8800)


| Comando | Salida (resumen) | Código |
|---|---|---|
| `examctl list --json` | JSON con 6 cuestionarios | 0 |
| `examctl create "Examen final" --json` | `{ id: 7, title: "Examen final" }` | 0 |
| `examctl delete 3 --yes` | `Eliminado 3` | 0 |
| `examctl delete 3` (sin --yes) | pide `--yes` | 8 |
| `examctl delete 999 --yes` | `No existe en el servidor.` | 5 |
| `examctl cors-check --origin http://localhost:5173` | Allow-Origin = origen | 0 |
| `examctl cors-check --origin https://sitio-malo.example` | sin Allow-Origin | 7 |
| API con `--wildcard`: mismo cors-check malo | Allow-Origin = `*` | 9 |


Los mensajes para personas van a stderr y el JSON a stdout, así un agente puede parsear stdout sin ruido. El código de salida permite a un agente decidir sin leer texto.


## 6. Tabla de uso de IA


| Pedido | Respuesta | Aceptado/Rechazado | Motivo (pregunta de revisión o prueba) | Evidencia |
|---|---|---|---|---|
| Implementar `src/client/api.js` | Código con TODOs resueltos | Aceptado | P4 (orígenes justos no aplica) + `npm test -- api` 14/14 | `npm test -- api` |
| Implementar `src/client/cors.js` | Política estricta | Aceptado | P4 + `npm test -- cors` 8/8 | `npm test -- cors` |
| Implementar `src/client/useExams.js` | Hook completo con cancelación y mutaciones | Aceptado | P1-P3 + `npm test -- useExams` 18/18 | `npm test -- useExams` |
| Revisar `src/ai/*` | 5 fallos clasificados y corregidos | Aceptado | P1-P4 + `npm run test:ai` 0/67 | `npm run test:ai` |


## 7. Capturas a tomar


- Pantalla cargando cuestionarios


<img width="957" height="862" alt="image" src="https://github.com/user-attachments/assets/135a88ac-54f6-4efe-92c4-02189a69b8af" />


- Tabla con los 6 cuestionarios


<img width="952" height="862" alt="image" src="https://github.com/user-attachments/assets/59ddf5a9-ea3c-4bd4-adca-55aa97c2739d" />


- Panel de red simulada, apagar el servidor, reintentar, aviso de error


<img width="1017" height="871" alt="image" src="https://github.com/user-attachments/assets/6e93ef64-4650-4933-a5bc-9177fdcab33a" />


- Formulario con título vacío → mensaje de la API


<img width="936" height="781" alt="image" src="https://github.com/user-attachments/assets/c40d2bb7-84ff-4275-85d0-133f06eeca6c" />


-  npm test en terminal


<img width="982" height="887" alt="image" src="https://github.com/user-attachments/assets/c3624c7d-bfb0-467b-927d-1f724fdeef3a" />


- npm run test:ai en la terminal 


<img width="962" height="876" alt="image" src="https://github.com/user-attachments/assets/fb80f120-6efa-4a12-9c0c-f563d19278a0" />











