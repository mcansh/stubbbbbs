packages=('testing' 'server-runtime' 'react')
for i in "${packages[@]}"; do
  yalc link @remix-run/$i
done
