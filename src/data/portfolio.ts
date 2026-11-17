// Todo o conteúdo do site fica aqui. Para atualizar projetos, experiências ou
// habilidades, edite este arquivo: os componentes não precisam mudar.

export const profile = {
  name: 'Kayky Fernandes Garcia',
  firstName: 'Kayky',
  initials: 'KF',
  title: 'Desenvolvimento de Software · Automação · Integração de Sistemas',
  tagline: 'Estudante de Sistemas de Informação · Estagiário de Sistemas',
  intro:
    'Desenvolvo formulários, fluxos e automações em sistemas corporativos e projetos próprios. Vim de infraestrutura e redes, então conheço o ambiente onde o software roda e as pessoas que o usam.',
  location: 'Rio Claro, SP',
  availability: 'Disponível para Rio Claro, Limeira e região',
  email: 'kaykyfernandes188@gmail.com',
  linkedin: 'https://linkedin.com/in/dev-kayky-fernandez',
  github: 'https://github.com/KaykyFernandez',
  // TODO: coloque o PDF do currículo em public/cv-kayky-fernandes.pdf
  // (use uma versão sem telefone e sem endereço, pois o site é público).
  cvUrl: '/cv-kayky-fernandes.pdf',
  // Foto em public/foto.jpg (quadrada, 480x480). Use null para voltar às iniciais.
  photo: '/foto.jpg' as string | null,
  heroTech: ['Java', 'Python', 'JavaScript', 'SQL', 'Node.js', 'Git', 'TOTVS Fluig'],
}

export const about = {
  paragraphs: [
    'Estudo Sistemas de Informação na FHO (Fundação Hermínio Ometto – Uniararas), no 4º semestre, com conclusão prevista para dezembro de 2028.',
    'Hoje sou estagiário de sistemas na Brascabos, onde desenvolvo formulários, widgets e fluxos BPMN no TOTVS Fluig com JavaScript, HTML e CSS, além de automações com RPA. Antes disso trabalhei com redes e suporte técnico em um provedor de internet e em uma unidade de saúde pública.',
    'Tenho interesse em back-end, automação, integração de sistemas, DevOps e cibersegurança.',
  ],
  facts: [
    { icon: 'book', value: '4º semestre', label: 'Sistemas de Informação, FHO' },
    { icon: 'briefcase', value: '3 empresas', label: 'de TI desde 2024' },
    { icon: 'code', value: 'TOTVS Fluig', label: 'Formulários, widgets e BPMN' },
    { icon: 'layers', value: 'Dev + Infra', label: 'Software e redes na mesma bagagem' },
  ],
} as const

export type Project = {
  id: string
  title: string
  kind: string
  status: 'concluido' | 'em-andamento'
  summary: string
  highlights?: string[]
  stack: string[]
  repo?: string
  demo?: string
  image?: string
  // true quando a imagem é uma ilustração (mockup), não uma captura de tela real.
  imageIsMockup?: boolean
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'automacao-pdf-whatsapp',
    title: 'Automação de PDFs com envio via WhatsApp',
    kind: 'Projeto pessoal',
    status: 'concluido',
    featured: true,
    summary:
      'Lê PDFs, extrai e trata os dados e envia as informações automaticamente pelo WhatsApp, eliminando o trabalho manual de copiar e enviar.',
    highlights: [
      'Integração entre Python e Node.js',
      'Padronização de telefones',
      'Interface de entrada e logs de sucesso/falha',
    ],
    stack: ['Python', 'Node.js', 'Pandas', 'PDFPlumber', 'Venom Bot', 'APIs'],
    image: '/projetos/automacao-pdf.jpg',
    imageIsMockup: true,
    // TODO: adicione o link do repositório em `repo` (ou deixe sem link se for privado).
  },
  {
    id: 'thermvaccine-pi',
    title: 'ThermVaccine_PI',
    kind: 'Projeto acadêmico',
    status: 'concluido',
    // TODO: descreva o que o sistema faz e complete a stack.
    summary:
      'Projeto acadêmico desenvolvido em equipe, com Git/GitHub, branches e resolução de conflitos.',
    stack: ['Git', 'GitHub'],
    // TODO: troque pelo link do repositório do projeto (hoje aponta para o perfil).
    repo: 'https://github.com/KaykyFernandez',
  },
  {
    id: 'karoquissimo',
    title: 'Karoquissimo',
    kind: 'Projeto web · Full stack',
    status: 'concluido',
    // TODO: complete a descrição e a stack reais e adicione o link no ar em `demo`.
    summary:
      'Sistema web full stack de controle de estoque, com desenvolvimento e manutenção de interfaces em fluxo colaborativo via Git/GitHub.',
    stack: ['Full stack', 'Git', 'GitHub'],
    image: '/projetos/karoquissimo.jpg',
    imageIsMockup: true,
    // TODO: troque pelo link do repositório do projeto (hoje aponta para o perfil).
    repo: 'https://github.com/KaykyFernandez',
  },
  {
    id: 'claquete',
    title: 'Claquete',
    kind: 'Projeto web · Full stack',
    // O front (Angular) ainda usa dados de exemplo; a API já existe, mas falta ligar os dois.
    status: 'em-andamento',
    summary:
      'Painel de gestão para um estúdio de vídeo e foto de casamentos e eventos: orçamentos em kanban com arrastar e soltar, agenda, financeiro, cobranças e clientes. Inclui uma API REST própria com banco SQLite e 77 testes automatizados.',
    stack: ['Angular', 'TypeScript', 'SCSS', 'Node.js', 'Express', 'SQLite', 'Zod'],
    image: '/projetos/claquete.jpg',
    // TODO: se subir o projeto no GitHub, adicione o link em `repo` (e o link no ar em `demo`).
  },
]

export type Experience = {
  role: string
  company: string
  place: string
  period: string
  current?: boolean
  minor?: boolean
  bullets?: string[]
}

export const experiences: Experience[] = [
  {
    role: 'Estagiário de Sistemas — Desenvolvimento e Automação',
    company: 'Brascabos Componentes Elétricos e Eletrônicos Ltda.',
    place: 'Rio Claro, SP',
    period: 'Fev/2026 – atual',
    current: true,
    bullets: [
      'Desenvolvimento e manutenção de formulários, widgets e fluxos BPMN no TOTVS Fluig, com JavaScript, HTML e CSS.',
      'Implementação de validações e funcionalidades conforme os requisitos das áreas de negócio.',
      'Desenvolvimento e manutenção de automações de rotinas com agentes de RPA.',
      'Participação em projetos de sistemas, do levantamento de necessidades à implementação.',
      'Administração de usuários e permissões no TOTVS e sustentação de sistemas corporativos (Progress, TOTVS Datasul, TOTVS Cloud, Fluig); suporte a usuários via GLPI.',
    ],
  },
  {
    role: 'Estágio Técnico de Suporte em TI',
    company: 'CIEE / UBS André Gimene — Prefeitura de Corumbataí',
    place: 'Corumbataí, SP',
    period: 'Nov/2025 – Out/2026',
    bullets: [
      'Suporte a médicos e enfermeiros no sistema ConectaSUS, com curso específico da plataforma.',
      'Identificação e relato de bugs; suporte a computadores, impressoras e telecom.',
    ],
  },
  {
    role: 'Analista de Redes e Suporte Técnico Júnior',
    company: 'COG Internet & Segurança Eletrônica Ltda.',
    place: 'Corumbataí, SP',
    period: 'Out/2024 – Nov/2025',
    bullets: [
      'Implementação e manutenção de sistemas internos, monitoramento de redes e infraestrutura.',
      'Suporte de segundo nível e resolução de incidentes, inclusive em campo.',
      'Grafana, UISP, MikroTik CCR, MK-AUTH e CMD/Telnet na configuração de antenas Ubiquiti e roteadores e no diagnóstico de conectividade.',
    ],
  },
  {
    role: 'Aprendiz Montador de Eletrodomésticos',
    company: 'Whirlpool Corporation',
    place: 'Rio Claro, SP',
    period: 'Mar/2024 – Out/2024',
    minor: true,
  },
]

export const skillGroups = [
  { title: 'Linguagens', items: ['Java', 'Python', 'JavaScript', 'C', 'SQL', 'HTML', 'CSS'] },
  { title: 'Back-end e dados', items: ['APIs REST', 'POO', 'Node.js', 'MySQL', 'MariaDB'] },
  {
    title: 'Ferramentas',
    items: ['Git', 'GitHub', 'GitHub Actions', 'NPM', 'Maven', 'Postman', 'VS Code'],
  },
  {
    title: 'Sistemas corporativos',
    items: ['TOTVS Fluig', 'TOTVS Datasul', 'TOTVS Cloud', 'GLPI', 'Mendix', 'RPA'],
  },
  {
    title: 'Infraestrutura e redes',
    items: ['Linux', 'Windows', 'TCP/IP', 'MikroTik', 'Ubiquiti/UISP', 'Grafana'],
  },
  { title: 'Deploy', items: ['Vercel', 'Render', 'Hostinger'] },
]

export const education = {
  degrees: [
    {
      title: 'Bacharelado em Sistemas de Informação',
      institution: 'FHO | Fundação Hermínio Ometto (Uniararas) — Araras, SP',
      period: 'Fev/2025 – Dez/2028',
      note: 'Cursando, 4º semestre',
    },
    {
      title: 'Inglês',
      institution: 'CNA',
      period: 'Cursando desde Jul/2026',
      note: 'Inglês básico, com foco em leitura de documentação técnica',
    },
  ],
  certifications: [
    'Aprenda JavaScript em 7 dias',
    'Discover',
    'NLW Pocket – Iniciantes (Fullstack)',
    'LowHack',
    'Minicurso de Python',
  ],
  languages: ['Português — nativo', 'Inglês — básico (leitura de documentação técnica)'],
}

export const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'formacao', label: 'Formação' },
] as const
