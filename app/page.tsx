import Link from 'next/link'

export default function Landing() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            ephemeral<span className="text-violet-400">.demos</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Despliega cualquier app con un <span className="text-white font-mono">docker-compose.yml</span> y obtén una URL pública en segundos. Sin cuenta, sin configuración, sin permanencia.
          </p>
          <Link
            href="/deploy"
            className="inline-block bg-violet-600 hover:bg-violet-500 transition-colors px-8 py-3 rounded-xl font-semibold text-sm"
          >
            Probar ahora →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl mb-3">📦</div>
            <h3 className="font-semibold text-sm mb-2">Sube tu compose</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Arrastra tu <span className="font-mono text-gray-400">docker-compose.yml</span> o selecciónalo. Cualquier imagen pública de Docker Hub funciona.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-sm mb-2">URL en segundos</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Tu app arranca en un contenedor aislado y recibe una URL pública única. Compártela con quien quieras al instante.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl mb-3">💨</div>
            <h3 className="font-semibold text-sm mb-2">Se destruye sola</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              A los 30 minutos el contenedor se elimina automáticamente. Sin residuos, sin costes acumulados, sin preocupaciones.
            </p>
          </div>
        </div>

        {/* Casos de uso */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">¿Para qué sirve?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🎯', text: 'Mostrar tu proyecto a un cliente o inversor' },
              { icon: '🧪', text: 'Probar una app antes de desplegarla en producción' },
              { icon: '👥', text: 'Compartir una demo en una entrevista técnica' },
              { icon: '🏫', text: 'Enseñar código funcionando en un taller o curso' },
              { icon: '🎮', text: 'Levantar un servidor de juegos temporal' },
              { icon: '🔗', text: 'Crear preview environments para Pull Requests' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-gray-400 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center">
          <Link
            href="/deploy"
            className="inline-block bg-violet-600 hover:bg-violet-500 transition-colors px-8 py-3 rounded-xl font-semibold text-sm mr-4"
          >
            Desplegar demo →
          </Link>
          <Link
            href="/demos"
            className="inline-block border border-gray-700 hover:border-gray-500 transition-colors px-8 py-3 rounded-xl font-semibold text-sm text-gray-400 hover:text-white"
          >
            Ver demos activas
          </Link>
        </div>

        <p className="text-center text-gray-700 text-xs mt-10">
          Desplegado en <span className="text-gray-500">CubePath</span> · Las demos se eliminan a los 30 minutos
        </p>

      </div>
    </main>
  )
}