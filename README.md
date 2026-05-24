# ephemeral.demos

Deploy any app with a `docker-compose.yml` and get a public URL in seconds. Demos self-destruct in 30 minutes.

🔗 **Demo en vivo:** http://194.26.100.130

<img width="1365" height="1128" alt="inicio" src="https://github.com/user-attachments/assets/eda1c003-5a97-41cf-8eb4-dde8ca11c474" />
<img width="1384" height="919" alt="deploy" src="https://github.com/user-attachments/assets/815894ea-2d38-4029-932b-317f26442768" />
<img width="1384" height="919" alt="demos" src="https://github.com/user-attachments/assets/b95807ee-7f29-448c-9b97-780842cb1dfb" />

## ¿Qué es?

Una plataforma donde cualquier developer puede desplegar una aplicación Docker en segundos y obtener una URL pública única. Sin cuenta, sin configuración, sin permanencia — el contenedor se destruye automáticamente a los 30 minutos.

## ¿Cómo funciona?

1. Sube tu `docker-compose.yml`
2. Opcionalmente añade título y descripción
3. Obtienes una URL pública en segundos
4. A los 30 minutos el contenedor se elimina solo

## Casos de uso

- Mostrar un proyecto a un cliente sin desplegarlo permanentemente
- Compartir una demo en una entrevista técnica
- Levantar un servidor de juegos temporal
- Preview environments para Pull Requests
- Enseñar código funcionando en talleres

## Cómo se ha utilizado CubePath

El proyecto está desplegado íntegramente en un VPS **gp.nano de CubePath** en Barcelona:

- **Next.js** corre en el VPS gestionado con PM2
- **Docker** orquesta los contenedores efímeros directamente en el servidor
- **Nginx** gestiona los subdominios dinámicos para cada demo
- Cada demo recibe una URL del tipo `{id}.194.26.100.130.nip.io`
- CubePath permite acceso directo al socket de Docker (`/var/run/docker.sock`), algo imposible en plataformas serverless como Vercel

## Stack técnico

- Next.js 16 + TypeScript
- SQLite (better-sqlite3)
- Docker + docker-compose
- Nginx con configuración dinámica
- PM2

## Instalación local
```bash
git clone https://github.com/sunshide12/ephemeral-demos
cd ephemeral-demos
npm install
npm run dev
```

## Ejemplo de docker-compose.yml
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "80"
```
