export interface SkillCategory {
  id: string
  number: string
  label: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    number: '01',
    label: 'Frontend Engineering',
    skills: [
      'JavaScript (ES6+)',
      'TypeScript',
      'Vue.js / Vue 3',
      'Nuxt 2 / Nuxt 3',
      'React',
      'Next.js',
      'Vite',
      'Tailwind CSS',
      'HTML5 / CSS3',
    ],
  },
  {
    id: 'backend',
    number: '02',
    label: 'Backend Engineering',
    skills: ['Python', 'Django', 'FastAPI', 'Node.js', 'REST API', 'GraphQL'],
  },
  {
    id: 'state-data',
    number: '03',
    label: 'State & Data',
    skills: [
      'Pinia',
      'Vuex',
      'Zustand',
      'Redux Toolkit',
      'PostgreSQL',
      'SQLite',
      'SQL',
    ],
  },
  {
    id: 'infrastructure',
    number: '04',
    label: 'Infrastructure',
    skills: [
      'Docker',
      'Docker Compose',
      'GitLab CI/CD',
      'GitHub Actions',
      'Linux',
      'Bash',
      'Nginx',
      'Git',
    ],
  },
  {
    id: 'ai-automation',
    number: '05',
    label: 'AI & Automation',
    skills: [
      'RAG Architectures',
      'Embeddings',
      'AI Agents',
      'Automation Systems',
      'API Integrations',
    ],
  },
]
