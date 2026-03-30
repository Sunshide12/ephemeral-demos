import db from './db'
import { destroyCompose } from './docker'
import { removeNginxConfig } from './nginx'

export function startCleanupWorker() {
  console.log('Cleanup worker iniciado')

  setInterval(async () => {
    const expired = db.prepare(
      "SELECT id FROM demos WHERE expires_at < ? AND status = 'running'"
    ).all(Date.now()) as { id: string }[]

    for (const demo of expired) {
      console.log(`Limpiando demo expirada: ${demo.id}`)
      await destroyCompose(demo.id)
      await removeNginxConfig(demo.id)
      db.prepare("UPDATE demos SET status = 'expired' WHERE id = ?").run(demo.id)
    }
  }, 60_000)
}