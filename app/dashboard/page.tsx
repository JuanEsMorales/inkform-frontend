"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { FormularioApi, FormularioConPreguntas } from "../types";
import { ButtonLink } from "../components/ButtonLink";
import { Button } from "../components/Button";
import Link from "next/link";
import { Trash } from "../icons/Trash";

const ESTADOS: Record<string, { etiqueta: string; clases: string; punto: string }> = {
  PUBLICADO: {
    etiqueta: "Publicado",
    clases: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    punto: "bg-emerald-500",
  },
  "SIN PUBLICAR": {
    etiqueta: "Sin publicar",
    clases: "bg-amber-50 text-amber-700 ring-amber-200",
    punto: "bg-amber-500",
  },
};

const fechaCorta = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Dashboard() {
  const [formularios, setFormularios] = useState<FormularioConPreguntas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresco, setRefresco] = useState(0);
  const [accionEnCurso, setAccionEnCurso] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<FormularioConPreguntas | null>(null);

  useEffect(() => {
    let cancelado = false;

    fetch("http://localhost:3100/forms")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los formularios");
        return res.json();
      })
      .then((data: FormularioConPreguntas[]) => {
        if (!cancelado) {
          setFormularios(data);
        }
      })
      .catch((e: unknown) => {
        if (!cancelado) {
          const mensaje = e instanceof Error ? e.message : "Error inesperado";
          setError(mensaje);
          toast.error(mensaje);
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [refresco]);

  const cambiarEstado = async (formulario: FormularioApi) => {
    const nuevoEstado =
      formulario.estado === "PUBLICADO" ? "SIN PUBLICAR" : "PUBLICADO";

    setAccionEnCurso(formulario.id_formulario);
    try {
      const res = await fetch(
        `http://localhost:3100/forms/${formulario.id_formulario}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );
      if (!res.ok) throw new Error(await res.text());

      setFormularios((prev) =>
        prev.map((f) =>
          f.formulario.id_formulario === formulario.id_formulario
            ? { ...f, formulario: { ...f.formulario, estado: nuevoEstado } }
            : f,
        ),
      );

      toast.success(
        nuevoEstado === "PUBLICADO"
          ? "Formulario publicado"
          : "Formulario despublicado",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo cambiar el estado",
      );
    } finally {
      setAccionEnCurso(null);
    }
  };

  const eliminar = async () => {
    if (!aEliminar || accionEnCurso) return;
    const id = aEliminar.formulario.id_formulario;

    setAccionEnCurso(id);
    try {
      const res = await fetch(`http://localhost:3100/forms/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());

      setFormularios((prev) =>
        prev.filter((f) => f.formulario.id_formulario !== id),
      );
      setAEliminar(null);
      toast.success("Formulario eliminado");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo eliminar el formulario",
      );
    } finally {
      setAccionEnCurso(null);
    }
  };

  const reintentar = () => {
    setError(null);
    setCargando(true);
    setRefresco((n) => n + 1);
  };

  const ordenados = [...formularios].sort(
    (a, b) =>
      +new Date(b.formulario.fecha_creacion) -
      +new Date(a.formulario.fecha_creacion),
  );

  return (
    <main className="min-h-dvh bg-bg-principal px-6 py-10 sm:px-10 lg:px-20">
      <Toaster position="top-right" />

      {aEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !accionEnCurso && setAEliminar(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              ¿Eliminar formulario?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Vas a eliminar <strong>{aEliminar.formulario.titulo}</strong> y sus{" "}
              {aEliminar.preguntas.length} preguntas. Esta acción no se puede
              deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                text="Cancelar"
                variant="CANCEL"
                size="normal"
                handleFunction={() => setAEliminar(null)}
              />
              <Button
                text="Eliminar"
                variant="DESTRUCTIVE"
                size="normal"
                handleFunction={eliminar}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo de InkForm"
              width={56}
              height={56}
              className="rounded-2xl shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                ¡Hola!
              </h1>
              <p className="text-gray-600">Bienvenido nuevamente a InkForm</p>
            </div>
          </div>

          <ButtonLink
            href="/forms/create"
            icon="PLUS"
            size="normal"
            text="Crear formulario"
          />
        </header>

        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Formularios creados
            </h2>
            {!cargando && !error && formularios.length > 0 && (
              <p className="text-sm text-gray-500">
                {formularios.length}{" "}
                {formularios.length === 1 ? "formulario" : "formularios"}
              </p>
            )}
          </div>

          {cargando ? (
            <SkeletonTabla />
          ) : error ? (
            <EstadoError mensaje={error} onReintentar={reintentar} />
          ) : formularios.length === 0 ? (
            <EstadoVacio />
          ) : (
            <TablaFormularios formularios={ordenados} accionEnCurso={accionEnCurso} onCambiarEstado={cambiarEstado} onEliminar={setAEliminar} />
          )}
        </section>
      </div>
    </main>
  );
}

function TablaFormularios({
  formularios,
  onCambiarEstado,
  onEliminar,
  accionEnCurso,
}: {
  formularios: FormularioConPreguntas[];
  onCambiarEstado: (f: FormularioApi) => void;
  onEliminar: (f: FormularioConPreguntas) => void;
  accionEnCurso: string | null;
}) {

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Formulario", "Preguntas", "Estado", "Fecha de creación", "Acciones"].map(
                (titulo) => (
                  <th
                    key={titulo}
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {titulo}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {formularios.map(({ formulario, preguntas }) => {
              const estado =
                ESTADOS[formulario.estado] ?? ESTADOS["SIN PUBLICAR"];
              const ocupado = accionEnCurso === formulario.id_formulario;
              return (
                <tr
                  key={formulario.id_formulario}
                  className="transition-colors hover:bg-accent/5"
                >
                  <td className="max-w-md px-6 py-4">
                    <Link href={`/forms/${formulario.id_formulario}`} className="font-medium text-gray-900 hover:text-accent">
                      {formulario.titulo}
                    </Link>
                    {formulario.descripcion && (
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {formulario.descripcion}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
                      {preguntas.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onCambiarEstado(formulario)}
                      disabled={ocupado}
                      title={formulario.estado === "PUBLICADO" ? "Despublicar" : "Publicar"}
                      aria-label={formulario.estado === "PUBLICADO" ? "Despublicar formulario" : "Publicar formulario"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 transition
                        ${estado.clases} ${ocupado ? "opacity-50" : "cursor-pointer hover:ring-2"}`}
                    >
                      <span className={`size-1.5 rounded-full ${estado.punto}`} />
                       {estado.etiqueta}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {fechaCorta(formulario.fecha_creacion)}
                  </td>
                  <td className="px-2 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onEliminar({ formulario, preguntas })}
                      disabled={ocupado}
                      aria-label={`Eliminar ${formulario.titulo}`}
                      title="Eliminar"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonTabla() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-6 border-b border-gray-100 px-6 py-5 last:border-0"
        >
          <div className="h-4 w-1/3 rounded-full bg-gray-200" />
          <div className="h-4 w-14 rounded-full bg-gray-200" />
          <div className="h-4 w-24 rounded-full bg-gray-200" />
          <div className="ml-auto h-4 w-24 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function EstadoVacio() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-16 text-center shadow-xl ring-1 ring-black/5">
      <Image src="/plus-bg.svg" alt="" width={64} height={64} />
      <h3 className="text-lg font-medium text-gray-900">
        Todavía no has creado ningún formulario
      </h3>
      <p className="max-w-sm text-sm text-gray-500">
        Crea tu primer formulario y empieza a recoger respuestas.
      </p>
      <ButtonLink
        href="/forms/create"
        icon="PLUS"
        size="normal"
        text="Crear el primero"
      />
    </div>
  );
}

function EstadoError({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-16 text-center shadow-xl ring-1 ring-black/5">
      <h3 className="text-lg font-medium text-gray-900">
        No pudimos cargar tus formularios
      </h3>
      <p className="max-w-sm text-sm text-gray-500">{mensaje}</p>
      <Button
        text="Reintentar"
        variant="CANCEL"
        size="normal"
        handleFunction={onReintentar}
      />
    </div>
  );
}
