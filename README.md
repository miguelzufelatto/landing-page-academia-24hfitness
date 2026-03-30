# 24h Fitness — Academia-24Horas

Site estático em HTML/CSS/Vanilla JS para a academia "24h Fitness".

Arquivos principais:

- `index.html`
- `styles/style.css` e `styles/style.min.css`
- `scripts/main.js` e `scripts/main.min.js`
- `assets/images/` (imagens de exemplo)
 - `index.html`
 - `styles/style.css`
 - `scripts/main.js`
 - `assets/images/` (imagens de exemplo)

Como abrir localmente:

1. Abra `index.html` no navegador (duplo clique) ou use um servidor local;
2. Para um servidor simples com Python 3:

```bash
python -m http.server 8000
# então abra http://localhost:8000
```

Notas:
- Projeto em HTML/CSS/Vanilla JS sem dependências externas.
- Atualizações de acessibilidade e pequenas melhorias já aplicadas (`skip-link`, IDs nos formulários, submissão por Fetch).
 - Projeto em HTML/CSS/Vanilla JS. Mantemos as fontes legíveis (`.css`/`.js`) no repositório para facilitar edição.
 - Se você precisar gerar versões minificadas localmente, adicione um `package.json` com as dependências de build (ex.: `postcss-cli`, `cssnano`, `terser`) e use `npm run build`.
 - Observação: existe um `package-lock.json` com devDependencies listadas — se não for usar ferramentas de build, ele pode ser removido.

Repositório remoto: https://github.com/miguelzufelatto/Academia-24Horas-

Contribuições: abra um pull request ou envie sugestões via Issues.

