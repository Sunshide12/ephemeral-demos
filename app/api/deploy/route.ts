import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import db from '@/lib/db'
import { deployCompose, getFreePort } from '@/lib/docker'
import { writeNginxConfig } from '@/lib/nginx'

const SERVER_IP = process.env.SERVER_IP || '194.26.100.130'
const TTL_MS = 30 * 60 * 1000

const FORBIDDEN = ['/var', '/etc', '/root', 'privileged', 'network_mode: host']

export async function POST(req: NextRequest) {
  try {
    const { compose, title, description } = await req.json()

    if (!compose || typeof compose !== 'string') {
      return NextResponse.json({ error: 'compose.yml requerido' }, { status: 400 })
    }

    for (const banned of FORBIDDEN) {
      if (compose.includes(banned)) {
        return NextResponse.json({ error: `Contenido no permitido: ${banned}` }, { status: 400 })
      }
    }

    const id = nanoid(8).toLowerCase().replace(/[^a-z0-9]/g, 'x')
    const port = await getFreePort()
    const expiresAt = Date.now() + TTL_MS

    const finalCompose = compose.replace(
      /(\s+- ["']?)(\d+):(\d+)(["']?)/g,
      `$1${port}:$3$4`
    )

    await deployCompose(id, finalCompose, port)
    await writeNginxConfig(id, port, SERVER_IP)

    db.prepare(
      'INSERT INTO demos (id, port, status, expires_at, title, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, port, 'running', expiresAt, title || null, description || null)

    return NextResponse.json({
      id,
      url: `http://${id}.${SERVER_IP}.nip.io`,
      expiresAt,
      minutesLeft: 30
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}