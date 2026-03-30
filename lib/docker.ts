import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

const DEMOS_DIR = '/tmp/demos'

export async function deployCompose(id: string, composeContent: string, port: number) {
  const safeId = id.toLowerCase()
  const dir = path.join(DEMOS_DIR, safeId)
  await fs.mkdir(dir, { recursive: true })

  // Usar el compose tal cual, sin modificar los puertos
  await fs.writeFile(path.join(dir, 'docker-compose.yml'), composeContent)

  await execAsync(
    `docker-compose -p demo-${safeId} -f ${dir}/docker-compose.yml up -d`,
    { timeout: 60000 }
  )
}

export async function destroyCompose(id: string) {
  const safeId = id.toLowerCase()
  const dir = path.join(DEMOS_DIR, safeId)
  try {
    await execAsync(`docker-compose -p demo-${safeId} -f ${dir}/docker-compose.yml down --volumes --remove-orphans`)
    await fs.rm(dir, { recursive: true, force: true })
  } catch {}
}

export async function getFreePort(): Promise<number> {
  const { stdout } = await execAsync(
    "ss -tlnp | awk '{print $4}' | grep -oP ':\\K\\d+' | sort -n"
  )
  const usedPorts = new Set(stdout.trim().split('\n').map(Number))
  for (let port = 3100; port < 9999; port++) {
    if (!usedPorts.has(port)) return port
  }
  throw new Error('No hay puertos disponibles')
}