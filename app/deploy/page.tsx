'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface DeployResult {
  id: string
  url: string
  expiresAt: number
  minutesLeft: number
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DeployResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [compose, setCompose] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const deploy = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compose: content, title, description })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [title, description])

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCompose(content)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const minutesLeft = result
    ? Math.max(0, Math.floor((result.expiresAt - Date.now()) / 60000))
    : 0

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">
            ephemeral<span className="text-violet-400">.demos</span>
          </h1>
          <p className="text-gray-400">Sube tu docker-compose.yml y obtén una URL en segundos</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
          className={[
            'border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer mb-4',
            isDragging
              ? 'border-violet-400 bg-violet-950/30'
              : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
          ].join(' ')}
        >
          <input
            id="fileInput"
            type="file"
            accept=".yml,.yaml"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="text-5xl mb-4">📦</div>
          {compose ? (
            <p className="text-green-400 font-mono text-sm">docker-compose.yml cargado ✓</p>
          ) : (
            <div>
              <p className="text-gray-300 font-medium mb-1">Arrastra tu docker-compose.yml aquí</p>
              <p className="text-gray-500 text-sm">o haz clic para seleccionar el archivo</p>
            </div>
          )}
        </div>

        {compose && (
          <textarea
            value={compose}
            onChange={(e) => setCompose(e.target.value)}
            className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-xs text-gray-300 mb-4 resize-none focus:outline-none focus:border-violet-500"
          />
        )}

        {/* Título y descripción opcionales */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional) — ej: Mi app de tareas"
            maxLength={60}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción (opcional) — ej: CRUD con React y PostgreSQL"
            maxLength={120}
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <button
          onClick={() => compose && deploy(compose)}
          disabled={!compose || loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Desplegando...' : 'Desplegar demo →'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 bg-gray-900 border border-violet-800 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Tu demo está lista</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 font-mono text-sm hover:underline break-all"
            >
              {result.url}
            </a>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-gray-400">
                Se destruye en{' '}
                <span className="text-white font-medium">{minutesLeft} minutos</span>
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result.url)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Copiar URL
            </button>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-10">
          Las demos se eliminan automáticamente a los 30 minutos
        </p>
        <div className="text-center mt-4">
          <Link href="/demos" className="text-xs text-gray-500 hover:text-violet-400 transition-colors">
            Ver demos activas →
          </Link>
        </div>

      </div>
    </main>
  )
}