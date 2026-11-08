"use client"

import Image from "next/image";
import { useState } from "react";
import {
  formMakingStates,
} from "@/app/consts";
import "../style.css";
import { ButtonLink } from "@/app/components/ButtonLink";
import { Button } from "@/app/components/Button";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import {
  Formulario,
  FormularioConPreguntas,
  QuestionToShow,
} from "@/app/types";
import { QuestionText } from "@/app/components/QuestionText";
import { QuestionOptions } from "@/app/components/QuestionOptions";
import { usePreguntasEditor } from "@/app/hooks/usePreguntasEditor";

export default function Editor({
  id,
  data,
}: {
  id: string;
  data: FormularioConPreguntas;
}) {
  const [formMaking, setFormMaking] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("makingStateEditing");
      return saved ? saved : formMakingStates.INITIAL;
    }
    return formMakingStates.INITIAL;
  });
  const [formularioInfo, setFormularioInfo] = useState<Formulario>(data.formulario);

  const aQuestionToShow = (f: FormularioConPreguntas): QuestionToShow[] =>
    f.preguntas.map(({ pregunta, opciones }) => ({
      id: pregunta.id_pregunta,
      texto: pregunta.texto,
      tipo: pregunta.tipo,
      obligatoria: Boolean(pregunta.obligatoria),
      orden: pregunta.orden,
      isEditing: false,
      options: pregunta.tipo === "OPCION MULTIPLE" ? opciones.map((o) => ({
        id_opcion: o.id_opcion,
        id_pregunta: o.id_pregunta,
        texto: o.texto,
      })) : [],
    }))

  const {
    handleCancelEditing,
    handleChangeIsEditing,
    handleChangeOptiontext,
    handleChangeQuestionTitle,
    handleChangeSelect,
    handleToggleObligatoria,
    preguntas,
  } = usePreguntasEditor(aQuestionToShow(data));

  const [isSaving, setIsSaving] = useState(false);

  const handleChangeTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormularioInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeDescripcion = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormularioInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeToQuestions = () => {
    if (formularioInfo.titulo.trim() === "")
      return toast.error("Debes proporcionar un título al formulario");
    setFormMaking(formMakingStates.QUESTIONS);
    localStorage.setItem("makingStateEditing", formMakingStates.QUESTIONS);
  };

  const handleChangeToInfo = () => {
    setFormMaking(formMakingStates.INITIAL);
    localStorage.setItem("makingStateEditing", formMakingStates.INITIAL);
  };

  const payload = {
    titulo: formularioInfo.titulo,
    descripcion: formularioInfo.descripcion,
    pregunta: preguntas.map((p) => ({
      id_pregunta: p.id,
      texto: p.texto,
      tipo: p.tipo,
      obligatoria: p.obligatoria,
    })),
    opcion: preguntas.flatMap((p) =>
      p.options
        .filter((o) => o.id_opcion)
        .map((o) => ({ id_opcion: o.id_opcion, texto: o.texto })),
    ),
  }

  const handleSaveChanges = async () => {
    for (const p of preguntas) {
      if (!p.texto.trim()) return toast.error("Hay una pregunta sin texto");
      if (p.options.some((op) => !op.texto.trim()))
        return toast.error("Hay una opción vacía");
    }
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3100/forms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const mensaje = await res.text();
        throw new Error(mensaje || "Error al guardar los cambios");
      }

      toast.success("Cambios guardados exitosamente");

      localStorage.removeItem("makingStateEditing");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor",
      );
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <main className="py-13 px-6 sm:px-50 lg:px-70 flex flex-col gap-9 relative">
      <Toaster position="top-right" />
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src={"/logo.png"} alt="logo inkform" height={60} width={60} />
          <h1 className="text-3xl font-medium">InkForm</h1>
        </div>
        {formMaking === formMakingStates.QUESTIONS && (
          <Button
            text="Volver"
            variant="GHOST"
            icon="BACK"
            handleFunction={handleChangeToInfo}
          />
        )}
      </header>
      {formMaking === formMakingStates.INITIAL ? (
        <>
          <section className="bg-white rounded-xl p-7 shadow-xl">
            <div className="flex items-center gap-2">
              <img src="/plus-bg.svg" width={60} />
              <h1 className="text-xl">Actualizar formulario</h1>
            </div>
            <p className=" text-gray-600 text-xl">
              Asegúrate de tener la información básica para tu formulario
            </p>
          </section>

          <section className="bg-white rounded-xl p-7 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label htmlFor="title" className="text-xl">
                Título del formulario
              </label>
              <input
                type="text"
                id="title"
                name="titulo"
                placeholder="Ej: Encuesta de satisfacción"
                className="px-4 py-6 border-gray-200 rounded-xl outline-0 text-xl transition focus:border-accent border-3"
                value={formularioInfo.titulo}
                onChange={handleChangeTitulo}
              />
              <p className="text-xl text-gray-700">
                Ingresa un título descriptivo para tu formulario
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="description" className="text-xl">
                Descripción del formulario{" "}
                <span className="text-gray-500">(Opcional)</span>
              </label>
              <textarea
                id="description"
                name="descripcion"
                placeholder="Ej: Este formulario tiene como objetivo conocer tu opinión sobre nuestros servicios..."
                className="px-4 py-6 border-gray-200 rounded-xl outline-0 text-xl transition focus:border-accent border-3 resize-none"
                rows={5}
                value={formularioInfo.descripcion}
                onChange={handleChangeDescripcion}
              />
              <p className="text-xl text-gray-700">
                Proporciona detalles sobre el propósito del formulario
              </p>
            </div>
          </section>

          <section className="flex justify-end gap-4">
            <ButtonLink href="/dashboard" text="Cancelar" variant="CANCEL" />
            <Button text="Continuar" handleFunction={handleChangeToQuestions} />
          </section>
        </>
      ) : (
        <>
          <section className="bg-white rounded-b-xl p-10 shadow-xl relative">
            <div className="bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] absolute h-3 w-full top-0 left-0"></div>
            <h1 className="text-xl mb-10">{formularioInfo.titulo}</h1>
            <p className=" text-gray-600 text-xl">
              {formularioInfo.descripcion
                ? formularioInfo.descripcion
                : "(No se ha proporcionado una descripción)"}
            </p>
          </section>
          {preguntas.map((p) =>
            p.tipo === "OPCION MULTIPLE" ? (
              <QuestionOptions
                key={p.id}
                pregunta={p}
                handleChangeEditing={handleChangeIsEditing}
                handleChangeQuestionTitle={handleChangeQuestionTitle}
                handleToggleObligatoria={handleToggleObligatoria}
                handleChangeSelect={handleChangeSelect}
                handleChangeOptiontext={handleChangeOptiontext}
                handleCancelEditing={handleCancelEditing}
                isEdition={true}
              />
            ) : (
              <QuestionText
                handleCancelEditing={handleCancelEditing}
                handleChangeEditing={handleChangeIsEditing}
                handleChangeQuestionTitle={handleChangeQuestionTitle}
                handleChangeSelect={handleChangeSelect}
                handleToggleObligatoria={handleToggleObligatoria}
                pregunta={p}
                key={p.id}
              />
            ),
          )}
          <div className="flex gap-4 fixed bottom-5 right-10">
            <ButtonLink href="/dashboard" text="Cancelar" variant="CANCEL" />
            <Button
              text="Guardar"
              variant="PRINCIPAL"
              icon="CHECK"
              disabled={isSaving}
              handleFunction={handleSaveChanges}
            />
          </div>
        </>
      )}
    </main>
  );
}
