// PART 1 - the API client module: the ONLY place that knows the API's address and how its errors look.
// No component writes a URL by hand; they all call these functions.
// Run it with:  npm test -- api
import axios from "axios";

export const API_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { Accept: "application/json" },
});

export function listExams({ signal } = {}) {
  return api.get("/exams/", { signal }).then((response) => response.data);
}

export function createExam(title) {
  return api.post("/exams/", { title }).then((response) => response.data);
}

export function deleteExam(id) {
  return api.delete(`/exams/${id}/`).then(() => undefined);
}

export function describeError(error) {
  if (!error?.response) {
    if (error?.code === "ERR_NETWORK") {
      return "No se pudo conectar con la API: verifica que el servidor este encendido y que el origen este autorizado en CORS.";
    }
    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
      return "La solicitud tardo demasiado en responder. Intenta de nuevo.";
    }
    return "Ocurrio un error inesperado al llamar a la API.";
  }
  const { status, data } = error.response;
  if (status === 400 && data && typeof data === "object") {
    const lines = Object.entries(data).map(([field, messages]) => `${field}: ${[].concat(messages).join(" ")}`);
    return `Datos no validos. ${lines.join(" ")}`;
  }
  if (status === 404) return "El recurso ya no existe en el servidor.";
  if (status >= 500) return `La API fallo (error ${status}). Intenta de nuevo en unos minutos.`;
  return `La API respondio con el estado ${status}.`;
}
