import { QuestionToShow } from "../types";
import { Button } from "./Button";

export function QuestionOptions({
  pregunta,
  handleChangeEditing,
  handleChangeQuestionTitle,
  handleChangeSelect,
  handleAddOption,
  handleToggleObligatoria,
  handleChangeOptiontext,
  handleDeleteOption,
  handleCancelEditing
}: {
    pregunta: QuestionToShow;
    handleChangeEditing: (id: string | undefined) => void;
    handleChangeQuestionTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeSelect: (id: string | undefined, tipo: QuestionToShow["tipo"]) => void;
    handleAddOption: (id: string | undefined) => void;
    handleChangeOptiontext: (questionId: string | undefined, index: number, texto: string) => void;
    handleToggleObligatoria: (id: string | undefined) => void;
    handleDeleteOption: (questionId: string | undefined, index: number) => void;
    handleCancelEditing: (id: string | undefined) => void;
}) {
  const { id, texto, tipo, obligatoria, options, isEditing } = pregunta;
  return (
    <div
      className={`bg-white rounded-xl p-7 shadow-xl flex flex-col relative transition-all ${isEditing ? "gap-5 ring-2 ring-accent/20" : "gap-2"}`}
    >
      {isEditing && (
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-xl bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)]" />
      )}
      <div className="absolute right-4 top-4 text-sm">
        {isEditing === false && (
          <Button
            text="Editar"
            icon="EDIT"
            variant="GHOST"
            size="normal"
            handleFunction={() => handleChangeEditing(id)}
          />
        )}
      </div>
      {isEditing === false ? (
        <>
          <header className="flex flex-col gap-4 border-b border-gray-300">
            <h1 className="text-xl">
              {texto} {obligatoria && <span className="text-red-700">*</span>}
            </h1>
            <p className="text-gray-600 mb-2">
              {tipo === "OPCION MULTIPLE" && "Opcion multiple"}
            </p>
          </header>
          <div className="flex flex-col gap-2">
            {options.map((op, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="radio" readOnly className="size-4" />
                <span>{op.texto}</span>
              </div>
            ))}
          </div>
          <p className=" text-gray-500">
            {obligatoria && "Esta pregunta es obligatoria"}
          </p>
        </>
      ) : (
        <>
          <header className="flex flex-col gap-4">
            <input
              type="text"
              name="texto"
              placeholder="Escribe tu pregunta aquí"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
              value={texto}
              id={id}
              onChange={handleChangeQuestionTitle}
            />
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  name="tipo"
                  id={id}
                  value={tipo}
                  className="cursor-pointer appearance-none rounded-full border-2 border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-accent"
                  onChange={(e) => handleChangeSelect(id, e.target.value as QuestionToShow["tipo"])}
                >
                  <option value="TEXTO CORTO">Respuesta corta</option>
                  <option value="TEXTO LARGO">Respuesta larga</option>
                  <option value="OPCION MULTIPLE">Opción múltiple</option>
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              {obligatoria && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Obligatoria
                </span>
              )}
            </div>
          </header>
          <section className="flex flex-col gap-3 border-t border-gray-200 pt-5 [&_svg]:size-5">
            <div className="flex flex-col gap-2">
              {options.map((op, index) => (
                <div key={index} className="group flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="size-5 shrink-0 rounded-full border-2 border-gray-300 bg-white transition group-focus-within:border-accent"
                  />
                  <input
                    type="text"
                    id={id}
                    name="texto"
                    placeholder={`Opción ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                    onChange={(e) => handleChangeOptiontext(id, index, e.target.value)}
                    value={op.texto}
                  />
                  <Button text="" icon="OPTDEL" variant="GHOST" handleFunction={() => handleDeleteOption(id, index)} />
                </div>
              ))}
            </div>
            <div className="flex">
              <Button
                text="Añadir opción"
                icon="PLUS"
                variant="ACCENT"
                size="normal"
                handleFunction={() => handleAddOption(id)}
              />
            </div>
              <footer className="flex justify-between border-t border-gray-200 p-7">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="obligatoria" checked={obligatoria} onChange={() => handleToggleObligatoria(id)} className="size-4" />
                  <label htmlFor="obligatoria" className="text-gray-700">Obligatoria</label>
                </div>
                <div className="flex gap-4">
                  <Button text="Cancelar" variant="CANCEL" handleFunction={() => handleCancelEditing(id)} />
                  <Button
                    text="Listo"
                    variant="PRINCIPAL"
                    icon="CHECK"
                    handleFunction={() => handleChangeEditing(id)}
                  />
                </div>
            </footer>
          </section>
        </>
      )}
    </div>
  );
}
