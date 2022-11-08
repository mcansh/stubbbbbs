packages=(
'architect'
'cloudflare'
'cloudflare-pages'
'cloudflare-workers'
'deno'
'dev'
'express'
'netlify'
'node'
'react'
'serve'
'server-runtime'
'testing'
'vercel'
)
for i in "${packages[@]}"; do
  yalc link @remix-run/$i
done
