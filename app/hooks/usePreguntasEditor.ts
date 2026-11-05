import { useState } from "react"
import { Pregunta, QuestionToShow } from "../types"

export function usePreguntasEditor(initial: QuestionToShow[]) {
  const [preguntas, setPreguntas] = useState(initial)
  const [preguntaBackup, setPreguntaBackup] = useState<QuestionToShow | null>(null)

  const handleChangeIsEditing = (id: string | undefined) => {
    if (!id) return
    const actual = preguntas.find((p) => p.id === id)

    if (actual && !actual.isEditing) {
      setPreguntaBackup({
        ...actual,
        options: actual.options.map((op) => ({...op })),
      })
    }

    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEditing: !p.isEditing } : p))
    );
  }

  const handleAddOption = (id: string | undefined) => {
    if (!id) return
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? {
        ...p, options: [...p.options, {
          id_pregunta: p.id,
          texto: "Nueva opción"
        }]} : p))
    );
  }

  const handleToggleObligatoria = (id: string | undefined) => {
    if (!id) return
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, obligatoria: !p.obligatoria } : p))
    );
  }

  const handleChangeQuestionTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, texto: value } : p))
    );
  }

  const handleChangeSelect = (questionId: string | undefined, tipo: Pregunta["tipo"]) => {
    if (!questionId) return
    setPreguntas((prev) => prev.map((p) => (p.id === questionId ? { ...p, tipo } : p)))
  }

  const handleChangeOptiontext = (questionId: string | undefined, index: number, texto: string) => {
    if (!questionId) return
    setPreguntas((prev) => prev.map((p) => (p.id === questionId ? {
      ...p,
      options: p.options.map((op, i) => (i === index ? {...op, texto } : op))
    }: p)))
  }

  const handleDeleteOption = (questionId: string | undefined, index: number) => {
    if (!questionId) return
    setPreguntas((prev) => prev.map((p) => p.id === questionId ? {
      ...p,
      options: p.options.filter((_, i) => i !== index)
    } : p))
  }

  const handleCancelEditing = (id: string | undefined) => {
    if (!id || !preguntaBackup) return
    setPreguntas((prev) => prev.map((p) => p.id === id ? {
      ...preguntaBackup,
      isEditing: false,
    } : p))
    setPreguntaBackup(null)
  }

  return {
    preguntas,
    setPreguntas,
    handleChangeIsEditing,
    handleAddOption,
    handleToggleObligatoria,
    handleChangeQuestionTitle,
    handleChangeSelect,
    handleChangeOptiontext,
    handleDeleteOption,
    handleCancelEditing,
  }
}
