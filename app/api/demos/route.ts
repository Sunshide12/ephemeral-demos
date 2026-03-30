import { NextResponse } from 'next/server'
import db from '@/lib/db'

const SERVER_IP = process.env.SERVER_IP || '194.26.100.130'

export async function GET() {
  const demos = db.prepare(
    "SELECT id, port, status, expires_at, created_at, title, description FROM demos WHERE status = 'running' ORDER BY created_at DESC"
  ).all() as any[]

  const now = Date.now()

  const result = demos.map(d => ({
    id: d.id,
    url: `http://${d.id}.${SERVER_IP}.nip.io`,
    minutesLeft: Math.max(0, Math.floor((d.expires_at - now) / 60000)),
    secondsLeft: Math.max(0, Math.floor((d.expires_at - now) / 1000)),
    createdAt: d.created_at,
    title: d.title || null,
    description: d.description || null
  }))

  return NextResponse.json({ demos: result, total: result.length })
}