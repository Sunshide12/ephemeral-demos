import fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function writeNginxConfig(id: string, port: number, ip: string) {
  const config = `
server {
  listen 80;
  server_name ${id}.${ip}.nip.io;

  location / {
    proxy_pass http://localhost:${port};
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
`
  await fs.writeFile(`/etc/nginx/conf.d/demo-${id}.conf`, config)
  await execAsync('nginx -s reload')
}

export async function removeNginxConfig(id: string) {
  try {
    await fs.unlink(`/etc/nginx/conf.d/demo-${id}.conf`)
    await execAsync('nginx -s reload')
  } catch {}
}