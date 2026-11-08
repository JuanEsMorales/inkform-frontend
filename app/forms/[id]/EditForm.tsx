"use client";

import { useEffect, useState } from "react";
import { FormularioConPreguntas } from "@/app/types";
import Editor from "./Editor";

export default function EditForm({ id }: { id: string }) {
  const [data, setData] = useState<FormularioConPreguntas | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    setData(null);
    setError(null);

    fetch(`http://localhost:3100/forms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el formulario");
        return res.json();
      })
      .then((json: FormularioConPreguntas) => {
        if (!cancelado) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelado)
          setError(e instanceof Error ? e.message : "Error inesperado");
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (error) return <p className="p-20 text-red-700">{error}</p>;
  if (!data) return <p className="p-20">Cargando formulario...</p>;

  return <Editor key={id} id={id} data={data} />;
}
