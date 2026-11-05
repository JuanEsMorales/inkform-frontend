"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FORMULARIO_INITIAL_STATE,
  PREGUNTAS_INITIAL_STATE,
  formMakingStates,
} from "@/app/consts";
import "../style.css";
import { ButtonLink } from "@/app/components/ButtonLink";
import { Button } from "@/app/components/Button";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import {
  Formulario,
  FormularioCompleto,
  Opcion,
  Pregunta,
  QuestionToShow,
} from "@/app/types";
import { QuestionText } from "@/app/components/QuestionText";
import { QuestionOptions } from "@/app/components/QuestionOptions";
import { usePreguntasEditor } from "@/app/hooks/usePreguntasEditor";

export default function Create() {
  const [formMaking, setFormMaking] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("makingState");
      return saved ? saved : formMakingStates.INITIAL;
    }
    return formMakingStates.INITIAL;
  });
  const [formularioInfo, setFormularioInfo] = useState<Formulario>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formularioInfo");
      return saved ? JSON.parse(saved) : FORMULARIO_INITIAL_STATE;
    }
    return FORMULARIO_INITIAL_STATE;
  });
  function initial() {
    if (typeof window === "undefined") return PREGUNTAS_INITIAL_STATE;
    try {
      const saved = localStorage.getItem("preguntas");
      return saved
        ? (JSON.parse(saved) as QuestionToShow[])
        : PREGUNTAS_INITIAL_STATE;
    } catch {
      return PREGUNTAS_INITIAL_STATE;
    }
  }
  const {
    handleAddOption,
    handleCancelEditing,
    handleChangeIsEditing,
    handleChangeOptiontext,
    handleChangeQuestionTitle,
    handleChangeSelect,
    handleDeleteOption,
    handleToggleObligatoria,
    preguntas,
    setPreguntas,
  } = usePreguntasEditor(initial());

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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
    localStorage.setItem("makingState", formMakingStates.QUESTIONS);
  };

  const handleChangeToInfo = () => {
    setFormMaking(formMakingStates.INITIAL);
    localStorage.setItem("makingState", formMakingStates.INITIAL);
  };

  function buildPayload(
    formulario: Formulario,
    preguntas: QuestionToShow[],
  ): FormularioCompleto {
    const preguntasPayload: Pregunta[] = [];
    const opcionesPayload: Opcion[] = [];

    preguntas.forEach((p, index) => {
      const id = crypto.randomUUID();

      preguntasPayload.push({
        id,
        texto: p.texto,
        tipo: p.tipo,
        obligatoria: p.obligatoria,
        orden: index,
      });

      p.options.forEach((op) => {
        opcionesPayload.push({ id_pregunta: id, texto: op.texto });
      });
    });

    return {
      formulario,
      preguntas: preguntasPayload,
      opciones: opcionesPayload,
    };
  }

  const handleCreateForm = async () => {
    if (preguntas.length === 0)
      return toast.error("Añade al menos una pregunta");

    for (const p of preguntas) {
      if (!p.texto.trim()) return toast.error("Hay una pregunta sin texto");
      if (p.tipo === "OPCION MULTIPLE" && p.options.length < 2)
        return toast.error(
          "Una pregunta de opción múltiple necesita al menos 2 opciones",
        );
      if (p.options.some((op) => !op.texto.trim()))
        return toast.error("Hay una opción vacía");
    }

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:3100/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formularioInfo, preguntas)),
      });

      if (!res.ok) {
        const mensaje = await res.text();
        throw new Error(mensaje || "Error al crear el formulario");
      }

      toast.success("Formulario creado exitosamente");

      localStorage.removeItem("formularioInfo");
      localStorage.removeItem("makingState");
      localStorage.removeItem("preguntas");
      setFormularioInfo(FORMULARIO_INITIAL_STATE);
      setPreguntas(PREGUNTAS_INITIAL_STATE);
      setFormMaking(formMakingStates.INITIAL);

      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("formularioInfo", JSON.stringify(formularioInfo));
  }, [formularioInfo]);

  useEffect(() => {
    localStorage.setItem("preguntas", JSON.stringify(preguntas));
  }, [preguntas]);

  return (
    <main className="py-13 px-70 flex flex-col gap-9 relative">
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
              <h1 className="text-xl">Crear nuevo formulario</h1>
            </div>
            <p className=" text-gray-600 text-xl">
              Completa la información básica para crear tu formulario
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
                handleAddOption={handleAddOption}
                handleToggleObligatoria={handleToggleObligatoria}
                handleChangeSelect={handleChangeSelect}
                handleChangeOptiontext={handleChangeOptiontext}
                handleDeleteOption={handleDeleteOption}
                handleCancelEditing={handleCancelEditing}
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
            <Button
              text="Cancelar"
              variant="CANCEL"
              handleFunction={handleChangeToInfo}
            />
            <Button
              text="Crear"
              variant="PRINCIPAL"
              icon="CHECK"
              handleFunction={handleCreateForm}
            />
          </div>
        </>
      )}
    </main>
  );
}
