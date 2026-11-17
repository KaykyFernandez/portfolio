# Documentação — redesign do portfólio e próximos passos

Registro do que foi feito na sessão de redesign (16/11/2026) e do que falta para publicar o site.
O `README.md` continua sendo o guia rápido (rodar, editar, publicar); este arquivo explica **o que mudou e por quê**.

---

## 1. Resumo

| Pedido | O que foi feito |
|---|---|
| "Faltou perfumaria", com o nível de acabamento do site do Lando Norris, mas **sem copiar os efeitos** | Redesign visual completo: abertura animada, tipografia gigante, cursor próprio, marquee, cards com spotlight e tilt, timeline que se desenha na rolagem, botões magnéticos. Efeitos originais. |
| Trocar o projeto **Mysorvetes** | Substituído pelo **Claquete** (pasta `projVdMaker`). |
| Imagens dos cards | Claquete (print real), Automação de PDFs / Codara.IA e Karoquissimo / estoque (ilustrações geradas por IA, com selo "Ilustração"). |
| Foto pessoal | Colocada no círculo do hero, cortada em quadrado no rosto. |
| Ajustes de posição | Cartão `perfil.ts` descido para não cobrir o rosto. |

Stack não mudou: React 19, Vite 8, TypeScript, Tailwind CSS v4. **Nenhuma biblioteca de animação foi adicionada**; tudo é CSS + hooks próprios. Única dependência nova: a fonte `@fontsource-variable/bricolage-grotesque`.

> Observação: a skill "ui-ux-pro-max" não existia na lista de skills desta sessão. O critério de UI/UX foi aplicado manualmente (hierarquia, contraste, estados de hover/foco, responsividade, acessibilidade e `prefers-reduced-motion`).

---

## 2. Direção visual

- **Referência de nível, não de cópia:** o site do Lando tem hero gigante, faixa em loop e cards que reagem ao mouse. Aqui os mesmos *níveis* de acabamento foram feitos com efeitos próprios (veja a tabela abaixo).
- **Paleta:** violeta (`--accent`) + verde-menta (`--accent-2`, nova) sobre azul-noite. Tema claro e escuro mantidos.
- **Tipografia:** Bricolage Grotesque (títulos, números) + Inter (texto). Os títulos usam peso 800 e espaçamento negativo.
- **Texto "fantasma":** onde antes se pensou em texto contornado (`-webkit-text-stroke`), foi usado preenchimento translúcido. Motivo: a fonte variável tem contornos sobrepostos que aparecem no traço (a barra do "A" ficava visível). Não volte para `text-stroke` sem testar.

### Efeitos e onde ficam

| Efeito | Onde está |
|---|---|
| Abertura com contador 000→100 e cortina que sobe | `components/Preloader.tsx` |
| Cursor próprio (ponto + anel que segue com atraso) | `components/Cursor.tsx` (só com mouse real) |
| Nome gigante entrando letra por letra, com máscara | `components/SplitText.tsx` + `.display-1/.display-2` em `index.css` |
| Fundo do hero: aurora, grade e brilho que segue o mouse | `Hero.tsx` + `.aurora`, `.hero-grid`, `.hero-spot` |
| Faixa de tecnologias que acelera/inverte com a rolagem | `components/Marquee.tsx` |
| Selo circular girando em volta da foto | `Badge()` em `Hero.tsx` |
| Cards com borda luminosa que segue o mouse e inclinação 3D | `components/Spotlight.tsx` + `.spot` |
| Botões "magnéticos" | `components/Magnetic.tsx` |
| Título de seção com número, máscara por palavra e traço que se desenha | `components/SectionHeading.tsx` |
| Linha da timeline que se preenche na rolagem | `Experience.tsx` (variável `--p`) |
| Barra de progresso de rolagem no topo | `components/ScrollProgress.tsx` |
| Links do menu que "rolam" no hover; navbar some ao descer e volta ao subir | `Navbar.tsx` + `.roll` |
| Grão de filme sobre a página | `body::after` em `index.css` |
| Placeholder animado (mesh) para capturas que ainda faltam | `.mesh` em `index.css` |

### Acessibilidade e desempenho

- `prefers-reduced-motion`: sem abertura, sem cursor próprio, sem animações; tudo aparece direto.
- Cursor próprio só liga com `(hover: hover) and (pointer: fine)`; em celular/tablet nada muda.
- Textos animados têm uma cópia `sr-only` para leitores de tela (as letras animadas ficam `aria-hidden`).
- Marquee pausa quando sai da tela; a rolagem usa `requestAnimationFrame` e listeners `passive`.
- Resultado verificado: sem erro no console, sem rolagem horizontal, tema claro e mobile (390 px) conferidos.

---

## 3. Mapa dos arquivos

```
src/
├── data/portfolio.ts        ← TODO o conteúdo (editar aqui)
├── index.css                ← tokens, temas, efeitos e animações
├── App.tsx                  ← monta a página (Preloader, Cursor, ScrollProgress, Navbar, seções)
├── components/
│   ├── Preloader.tsx  Cursor.tsx  ScrollProgress.tsx        (globais)
│   ├── SplitText.tsx  Reveal.tsx  Magnetic.tsx  Spotlight.tsx  Marquee.tsx   (efeitos reutilizáveis)
│   ├── Navbar.tsx  Hero.tsx  About.tsx  Projects.tsx  Experience.tsx
│   ├── Skills.tsx  Education.tsx  Contact.tsx  Footer.tsx   (seções)
│   ├── SectionHeading.tsx  Icons.tsx
└── hooks/
    ├── useInView.ts  usePrefersReducedMotion.ts   (novos)
    └── useActiveSection.ts  useTheme.ts           (já existiam)
public/
├── foto.jpg                 ← sua foto (480×480, 27 KB)
└── projetos/                ← imagens dos cards
    ├── claquete.jpg  automacao-pdf.jpg  karoquissimo.jpg
```

Como o hero sabe quando começar a animar: o `Preloader` marca `<html data-ready="1">` quando a cortina começa a subir. O CSS (`:root[data-ready] ...`) dispara as entradas do hero a partir disso. Sem preloader (movimento reduzido), o atributo é marcado na hora.

---

## 4. Conteúdo alterado

### Projetos (`src/data/portfolio.ts`)

| Projeto | Imagem | Status | Pendências |
|---|---|---|---|
| Automação de PDFs com envio via WhatsApp (destaque) | `automacao-pdf.jpg` (ilustração "Codara.IA") | Concluído | Link do repositório (`repo`) |
| ThermVaccine_PI | **sem imagem** (placeholder) | Concluído | Imagem, o que faz, stack, repo (hoje aponta para o seu perfil) |
| Karoquissimo | `karoquissimo.jpg` (ilustração de estoque) | Concluído | Descrição/stack reais, repo (hoje aponta para o perfil), `demo` |
| **Claquete** (novo, no lugar do Mysorvetes) | `claquete.jpg` (print real) | Em desenvolvimento | Repo/`demo`; mudar para `'concluido'` quando o front estiver ligado à API |

- **Claquete:** painel de gestão para um estúdio de vídeo e foto (Angular + API própria em Node/Express/SQLite com 77 testes). O front ainda usa dados de exemplo; a API existe, mas falta ligar os dois. Por isso o status é "em desenvolvimento".
- **Selo "Ilustração":** `imageIsMockup: true` mostra a etiqueta nas imagens geradas por IA, para não parecerem prints reais. Remova a flag quando trocar por capturas reais.
- **Aviso sobre o Karoquissimo:** a imagem do estoque mostra o nome "CodaraStock", não "Karoquissimo". Considere gerar de novo com o nome certo ou usar um print real.
- O resumo do Karoquissimo foi ajustado para "sistema web full stack de controle de estoque" com base no que você informou; confirme se está correto.

### Foto

`profile.photo = '/foto.jpg'`. Foi cortada de uma selfie de espelho (800×800) em um quadrado centralizado no rosto. Para voltar às iniciais "KF", use `photo: null`.

---

## 5. Como prosseguir

### 5.1 Antes de publicar (essenciais)

1. **Currículo em PDF:** salvar em `public/cv-kayky-fernandes.pdf`, sem telefone e sem endereço (site público). Enquanto não existir, o botão "Baixar currículo" dá erro 404.
2. **Links dos repositórios:** preencher `repo` nos projetos. Hoje ThermVaccine_PI e Karoquissimo apontam para o perfil do GitHub, o que parece link quebrado para quem clica.
3. **ThermVaccine_PI:** você ainda tem acesso ao projeto. Traga: o que o sistema faz, a stack completa, o repositório e um print da tela. Com isso eu fecho o card.
4. **Revisar o texto do Karoquissimo** e decidir se a imagem de estoque fica (ver aviso acima).

### 5.2 Publicar (Vercel)

1. `git init`, commit e `git push` para um repositório no GitHub. (A pasta ainda **não é** um repositório Git.)
2. Em vercel.com: **Add New → Project**, importar o repositório. A Vercel detecta Vite sozinha (Build: `npm run build`, Output: `dist`).
3. Depois do deploy, editar o `index.html`: adicionar `og:url` e `og:image` (imagem **1200×630**, URL absoluta). Trocar `twitter:card` para `summary_large_image` se usar imagem grande.
4. Opcional: alinhar `<meta name="theme-color">` do `index.html` (`#0a0b1f`) com o novo fundo (`--bg: #08091a`).

### 5.3 Melhorias futuras sugeridas

- **Prints reais** dos projetos no lugar das ilustrações (recrutador valoriza o que é verdadeiro e costuma perguntar sobre o que aparece).
- Foto de rosto em fundo neutro, no lugar da selfie de espelho (o rosto fica pequeno e o celular cobre parte).
- Foto também na seção "Sobre mim" (hoje só tem os quatro cartões).
- Seção de contato com formulário (hoje é só e-mail, LinkedIn, GitHub e currículo).
- Testes visuais/a11y: rodar Lighthouse após o deploy e conferir contraste do texto "fantasma" no tema claro.
- Quando o Claquete estiver com front ligado à API, trocar o status para `'concluido'` e publicar uma demo (`demo`).

---

## 6. Como ajustar os efeitos

| Quero… | Onde mexer |
|---|---|
| Trocar cores | `--accent`, `--accent-fg`, `--accent-2` em `src/index.css` (tema escuro e claro) |
| Preloader mais curto/longo | `DURATION` em `components/Preloader.tsx` (ms) |
| Tirar o preloader | remover `<Preloader />` em `App.tsx` e marcar `document.documentElement.dataset.ready = '1'` (ou manter o componente: ele já faz isso com movimento reduzido) |
| Tirar o cursor próprio | remover `<Cursor />` em `App.tsx` |
| Velocidade do marquee | prop `speed` em `Marquee` (padrão 0,7 px/quadro); a reação à rolagem fica em `components/Marquee.tsx` |
| Menos inclinação nos cards | prop `tilt` em `<Spotlight tilt={…}>` (graus; `0` desliga) |
| Tamanho do nome no hero | `.display-1` e `.display-2` em `index.css` |
| Posição do cartão `perfil.ts` | `Portrait()` em `Hero.tsx` (classes `-bottom-44`, `-right-12`) e o `pb-44` do bloco que o contém |
| Atrasos da entrada do hero | `--d` (ms) nos elementos `.rise` e `delay`/`stagger` nos `SplitText` de `Hero.tsx` |

---

## 7. Comandos

```bash
npm run dev      # desenvolvimento (porta 5173 por padrão)
npm run build    # verifica tipos e gera dist/
npm run preview  # serve o build
npm run lint     # oxlint (sem avisos no estado atual)
```

Estado ao fim da sessão: `npm run build` e `npm run lint` passam sem erros ou avisos.
Um servidor de teste (`vite`, porta 5199) pode ter ficado aberto no seu computador; feche o terminal/processo dele se estiver pesando.

---

## 8. Cenas 3D com Three.js (17/11/2026)

Pedido: "usar o Three.js e fazer algumas coisas em 3D". Foram adicionadas três cenas, cada uma ligada ao tema do perfil (software + redes):

| Cena | Seção | O que faz | Arquivo |
|---|---|---|---|
| Onda de partículas | Hero (fundo) | ~14 mil pontos formando um "terreno" em onda; o mouse cria uma ondulação onde aponta e a câmera acompanha de leve. Substitui a grade em CSS (que volta sozinha se não houver WebGL). | `src/three/heroWave.ts` |
| Globo de tecnologias | Habilidades | As tecnologias de `skillGroups` numa esfera, ligadas como uma rede, com "pacotes" de luz passando pelas ligações. Arrastar gira (com inércia), passar o mouse destaca. No desktop fica fixo à esquerda enquanto os cartões rolam. | `src/three/techGlobe.ts` |
| Orbe | Contato | Esfera deformada por ruído 3D no shader, com brilho nas bordas, casca geométrica e anel de partículas. Vira para o mouse e fica mais agitada com movimentos rápidos. | `src/three/contactOrb.ts` |

Dependências novas: `three` e `@types/three` (dev).

### Como funciona

- `src/three/stage.ts`: base comum. Cria o renderer, ajusta o tamanho (ResizeObserver), **pausa a animação fora da tela e com a aba oculta**, lê as cores das variáveis CSS (`--accent`, `--accent-2`…) e **troca as cores junto com o tema** claro/escuro. Também limpa tudo (GPU inclusive) ao desmontar.
- `src/components/ThreeScene.tsx`: container React. **O three.js só é baixado quando a cena chega perto da tela** (chunk separado de ~136 kB gzip), então o carregamento inicial do site não mudou.
- Cores: a gestão de cor do three está desligada de propósito, para o hex do CSS sair idêntico na tela.

### Acessibilidade e desempenho

- Cenas são decorativas (`aria-hidden`); o conteúdo continua nos cartões e textos.
- `prefers-reduced-motion`: as cenas aparecem como um quadro parado (o globo ainda gira ao arrastar).
- Sem WebGL: nada quebra; o hero volta para a grade em CSS.
- Densidade de pixels limitada (1,5 a 2) para não pesar em telas retina.
- No celular, o globo aceita arrastar na horizontal e a rolagem vertical continua normal (`touch-action: pan-y`).
- Verificado em navegador (Edge headless): tema escuro e claro, 1440 px e 390 px, sem erros no console e sem rolagem horizontal. `npm run build` e `npm run lint` passam.

### Como ajustar

| Quero… | Onde mexer |
|---|---|
| Onda mais densa/rala | `cols` e `rows` em `heroWave.ts` |
| Onda mais alta/calma | as somas de `sin`/`cos` no `waveVertex` e o `* 0.65` |
| Tamanho dos pontos da onda | `uSize` em `heroWave.ts` |
| Tamanho dos nomes no globo | `LABEL_HEIGHT` em `techGlobe.ts` |
| Velocidade do giro do globo | `autoSpin` em `techGlobe.ts` |
| Orbe mais/menos deformado | `uAmp` (base `0.3`) em `contactOrb.ts` |
| Posição/tamanho do orbe | classes do `<ThreeScene … className="orb-scene …">` em `Contact.tsx` |
| Tirar uma cena | remover o `<ThreeScene>` da seção correspondente |
