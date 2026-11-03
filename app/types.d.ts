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
