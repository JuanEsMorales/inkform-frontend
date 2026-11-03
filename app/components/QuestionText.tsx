import { QuestionToShow } from "../types"

export function QuestionText({ texto, tipo, obligatoria, setInfoQuestion }: QuestionToShow) {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="title" className="text-xl">
        Título del formulario
      </label>
      <input
        type="text"
        id="title"
        name="titulo"
        placeholder="Ej: Encuesta de satisfacción"
        className="px-2 py-4 border-gray-200 rounded-xl outline-0 text-sm transition focus:border-accent border-3"
        value={texto}
      />
      <p className="text-xl text-gray-700">
        Ingresa un título descriptivo para tu formulario
      </p>
    </div>
  )
}
