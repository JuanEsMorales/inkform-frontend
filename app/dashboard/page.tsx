import './style.css'

export default function Dashboard() {
  return (
    <main className="bg-gray-100 h-dvh p-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">¡Hola!</h1>
          <h3 className="text-gray-700">Bienvenido nuevamente a InkForm</h3>
        </div>
        <a href='/forms/create' className="flex items-center gap-2 py-2 px-4 bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] rounded-xl text-white transition hover:brightness-125">
          <img src="/plus.svg" alt="plus" /> Crear formulario
        </a>
      </header>
      <section className='mt-10 flex flex-col gap-5'>
        <h2 className='text-xl font-medium'>Formularios creados</h2>
        <div className='rounded-xl overflow-hidden shadow'>
          <table>
            <thead>
              <tr>
                <th>Formulario</th>
                <th>Respuestas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Encuesta</td>
                <td>20</td>
                <td>Cerrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
