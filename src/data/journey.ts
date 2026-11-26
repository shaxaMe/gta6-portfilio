export interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
  tags: string[]
  position: 'top' | 'bottom'
}

export const journey: JourneyMilestone[] = [
  {
    id: 'j1',
    year: '2021',
    title: 'First Lines of Code',
    description: 'Discovered web development. HTML, CSS, vanilla JS — the building blocks of everything.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    position: 'top',
  },
  {
    id: 'j2',
    year: '2022',
    title: 'Frontend Engineering',
    description: 'Went deep on Vue.js ecosystem, built real production interfaces and mastered TypeScript.',
    tags: ['Vue.js', 'TypeScript', 'Nuxt', 'Tailwind'],
    position: 'bottom',
  },
  {
    id: 'j3',
    year: '2023',
    title: 'Full-Stack Leap',
    description: 'Crossed into backend — Python, Django, REST APIs, PostgreSQL, Docker. The full picture.',
    tags: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker'],
    position: 'top',
  },
  {
    id: 'j4',
    year: '2024',
    title: 'Systems & Automation',
    description: 'Built e-commerce integrations, trading automation tools, and CI/CD pipelines.',
    tags: ['Node.js', 'GraphQL', 'Shopify API', 'GitHub Actions'],
    position: 'bottom',
  },
  {
    id: 'j5',
    year: '2025',
    title: 'AI & Beyond',
    description: 'Exploring RAG architectures, embeddings, AI agents and the edges of what\'s possible.',
    tags: ['RAG', 'Embeddings', 'AI Agents', 'React', 'Next.js'],
    position: 'top',
  },
]
