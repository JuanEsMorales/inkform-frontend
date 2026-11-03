import type { Formulario, Pregunta, Opcion, QuestionToShow } from "@/app/types";

export const formMakingStates = {
  INITIAL: "initial",
  QUESTIONS: "questions",
};

export const FORMULARIO_INITIAL_STATE: Formulario = {
  id_usuario: 1,
  titulo: "",
  descripcion: "",
  estado: "SIN PUBLICAR",
};

const OPCIONES_INITIAL_STATE: Opcion[] = [
  {
    id_pregunta: "pregunta1",
    texto: "Buena",
  },
  {
    id_pregunta: "pregunta1",
    texto: "Regular",
  },
  {
    id_pregunta: "pregunta1",
    texto: "Mala",
  },
];

export const PREGUNTAS_INITIAL_STATE: QuestionToShow[] = [
  {
    id: "pregunta1",
    texto: "¿Como fue su experiencia?",
    tipo: "OPCION MULTIPLE",
    obligatoria: true,
    isEditing: false,
    options: OPCIONES_INITIAL_STATE,
    orden: 0,
  },
];
