import Image from "next/image";
import "../style.css"
import { ButtonLink } from "@/app/components/ButtonLink";
import { Button } from "@/app/components/Button";

export default function Create() {
  return (
    <main className="py-13 px-70 flex flex-col gap-9">
      <div className="flex items-center gap-4">
          <Image src={"/logo.png"} alt="logo inkform" height={60} width={60}/>
          <h1 className="text-3xl font-medium">InkForm</h1>
      </div>
      <section className="bg-white rounded-xl p-7 shadow-xl">
        <div className="flex items-center gap-2">
          <img src="/plus-bg.svg" width={60} />
          <h1 className="text-xl">Crear nuevo formulario</h1>
        </div>
        <p className=" text-gray-600 text-xl">Completa la información básica para crear tu formulario</p>
      </section>

      <section className="bg-white rounded-xl p-7 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="title" className="text-xl">Título del formulario</label>
          <input type="text" id="title" placeholder="Ej: Encuesta de satisfacción" className="px-4 py-6 border-gray-200 rounded-xl outline-0 text-xl transition focus:border-accent border-3" />
          <p className="text-xl text-gray-700">Ingresa un título descriptivo para tu formulario</p>
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="description" className="text-xl">Descripción del formulario <span className="text-gray-500">(Opcional)</span></label>
          <textarea id="description" placeholder="Ej: Este formulario tiene como objetivo conocer tu opinión sobre nuestros servicios..." className="px-4 py-6 border-gray-200 rounded-xl outline-0 text-xl transition focus:border-accent border-3" rows={5} />
          <p className="text-xl text-gray-700">Proporciona detalles sobre el propósito del formulario</p>
        </div>
      </section>

      <section className="flex justify-end gap-4">
        <ButtonLink href="/dashboard" text="Cancelar" variant="CANCEL" />
        <Button text="Continuar" />
      </section>
    </main>
  )
}
