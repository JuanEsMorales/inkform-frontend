export interface PropButton {
  variant?: "PRINCIPAL" | "CANCEL" | "DESTRUCTIVE" | "ACCENT" | "GHOST"
  size?: "normal" | "big"
  handleFunction?: () => void
  icon?: "BACK" | "EDIT" | "OPTDEL" | "PLUS" | "CHECK"
  text: string
}

export interface PropButtonLink extends PropButton {
  href: string
}

export interface Formulario {
  id_usuario: number;
  titulo: string;
  descripcion: string;
  estado: "SIN PUBLICAR" | "PUBLICADO" | string;
}

export interface Pregunta {
  id?: string;
  texto: string;
  tipo: "OPCION MULTIPLE" | "TEXTO LARGO" | "TEXTO CORTO";
  obligatoria: boolean;
  orden?: number;
}

export interface QuestionToShow extends Pregunta {
  isEditing?: boolean;
  options: Opcion[];
}

export interface Opcion {
  id_pregunta: string;
  texto: string;
}

export interface FormularioCompleto {
  formulario: Formulario;
  preguntas: Pregunta[];
  opciones: Opcion[];
}

export interface OpcionApi {
  id_opcion: string;
  id_pregunta: string;
  texto: string;
}

export interface PreguntaApi {
  id_pregunta: string;
  id_formulario: string;
  texto: string;
  tipo: "OPCION MULTIPLE" | "TEXTO LARGO" | "TEXTO CORTO";
  obligatoria: number;
  orden: number;
}

export interface FormularioApi {
  id_formulario: string;
  id_usuario: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
}

export interface FormularioConPreguntas {
  formulario: FormularioApi;
  preguntas: { pregunta: PreguntaApi; opciones: OpcionApi[] }[];
}
