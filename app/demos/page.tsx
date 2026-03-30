'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Demo {
  id: string
  url: string
  minutesLeft: number
  secondsLeft: number
  createdAt: number
  title: string | null
  description: string | null
}

function CountdownBar({ secondsLeft }: { secondsLeft: number }) {
  const total = 30 * 60
  const pct = Math.max(0, (secondsLeft / total) * 100)
  const color = pct > 50 ? 'bg-violet-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function DemoCard({ demo }: { demo: Demo }) {
  const [secondsLeft, setSecondsLeft] = useState(demo.secondsLeft)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          {demo.id}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${secondsLeft > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {secondsLeft > 0 ? 'activa' : 'expirada'}
          </span>
        </div>
      </div>

      {demo.title && (
        <p className="text-white text-sm font-medium mb-1">{demo.title}</p>
      )}
      {demo.description && (
        <p className="text-gray-500 text-xs mb-3">{demo.description}</p>
      )}

      <a
        href={demo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 text-sm font-mono hover:underline break-all block mb-4"
      >
        {demo.url}
      </a>

      <CountdownBar secondsLeft={secondsLeft} />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">tiempo restante</span>
        <span className={`text-xs font-mono font-medium ${mins < 5 ? 'text-red-400' : 'text-gray-300'}`}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default function DemosPage() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDemos() {
      try {
        const res = await fetch('/api/demos')
        const data = await res.json()
        setDemos(data.demos)
        setTotal(data.total)
      } finally {
        setLoading(false)
      }
    }

    fetchDemos()
    const interval = setInterval(fetchDemos, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              ephemeral<span className="text-violet-400">.demos</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {total} demo{total !== 1 ? 's' : ''} activa{total !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors border border-violet-800 hover:border-violet-600 px-4 py-2 rounded-lg"
          >
            + Nueva demo
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Cargando...</div>
        ) : demos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No hay demos activas ahora mismo</p>
            <Link href="/" className="text-violet-400 hover:underline text-sm">
              Despliega la primera →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demos.map(demo => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>
        )}

        <p className="text-center text-gray-700 text-xs mt-12">
          Las demos se actualizan cada 30 segundos
        </p>
      </div>
    </main>
  )
}