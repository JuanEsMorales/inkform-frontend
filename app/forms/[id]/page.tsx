import { Suspense } from "react";
import EditForm from "./EditForm";

export default function Page({ params }: PageProps<"/forms/[id]">) {
  return (
    <Suspense fallback={<p className="p-20">Cargando formulario...</p>}>
      <Loader params={params} />
    </Suspense>
  );
}

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditForm id={id} />;
}
