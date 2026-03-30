import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const demo = db.prepare('SELECT * FROM demos WHERE id = ?').get(id) as any

  if (!demo) {
    return NextResponse.json({ error: 'Demo no encontrada' }, { status: 404 })
  }

  const minutesLeft = Math.max(0, Math.floor((demo.expires_at - Date.now()) / 60000))

  return NextResponse.json({
    id: demo.id,
    status: demo.status,
    minutesLeft,
    expiresAt: demo.expires_at
  })
}