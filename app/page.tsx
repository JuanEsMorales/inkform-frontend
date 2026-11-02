import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-3 items-center py-32 px-16 bg-white sm:items-start">
        <header className="flex items-center gap-3">
          <Image src={"/logo.png"} alt="logo inkform" height={100} width={100}/>
          <h1 className="text-4xl font-bold">Inkform</h1>
        </header>
        <h1 className="text-3xl text-black">¡Hola! ve al <a href="/dashboard" className="underline flex gap-2 items-center">Dashboard <img src="/link.svg" /></a> para empezar a trabajar con tus formularios</h1>
      </main>
    </div>
  );
}
