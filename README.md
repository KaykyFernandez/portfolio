# Portfólio — Kayky Fernandes Garcia

Site de portfólio em página única. React 19 + Vite + TypeScript + Tailwind CSS v4.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/ (verifica tipos antes)
npm run preview    # serve o build de produção
npm run lint
```

## Onde editar o conteúdo

Tudo fica em `src/data/portfolio.ts`: dados pessoais, projetos, experiências,
habilidades e formação. Os componentes em `src/components/` só exibem esses dados.

A paleta e os temas claro/escuro ficam em `src/index.css` (variáveis `--accent*`, `--bg`, etc.).

## Publicar na Vercel

1. Suba o projeto para um repositório no GitHub (`git init`, commit, `git push`).
2. Em vercel.com, clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta Vite sozinha (Build: `npm run build`, Output: `dist`). Clique em **Deploy**.
4. Depois de publicado, edite `index.html` e adicione `og:url` e `og:image` com o endereço final.

## TODO — o que falta você preencher

- [ ] Currículo: coloque o PDF em `public/cv-kayky-fernandes.pdf` (sem telefone e sem endereço, pois o site é público). Enquanto não existir, o botão de download dá erro 404.
- [ ] Projeto **Automação de PDFs**: link do repositório em `repo` (ou deixe sem link se for privado).
- [ ] Projeto **ThermVaccine_PI**: o que o sistema faz, stack completa e link do repositório (hoje o botão aponta para o seu perfil no GitHub).
- [ ] Projeto **Karoquissimo**: o que o sistema faz, stack, link do repositório (hoje aponta para o perfil) e link no ar em `demo`.
- [ ] Projeto **Claquete**: link do repositório em `repo` e, se publicar, o link no ar em `demo`. Quando o front estiver ligado à API, troque o status para `'concluido'`.
- [ ] Capturas de tela dos projetos (o Claquete já tem): coloque em `public/projetos/` e informe o caminho em `image` de cada projeto.
- [ ] Imagem de compartilhamento (1200x630) e `og:url` no `index.html`.
