export interface Project {
  id: string
  number: string
  title: string
  category: string
  year: string
  tech: string[]
  description: string
  url: string | null
  accentColor: string
}

export const projects: Project[] = [
  {
    id: 'getbiz',
    number: '01',
    title: 'GETBIZ',
    category: 'Web Application',
    year: '2024',
    tech: ['React', 'Next.js', 'TypeScript'],
    description:
      'Frontend development and modern web interface implementation for a business platform.',
    url: null,
    accentColor: '#c8f135',
  },
  {
    id: 'smart-money-bot',
    number: '02',
    title: 'SMART MONEY BOT',
    category: 'Automation / FinTech',
    year: '2024',
    tech: ['Python', 'FastAPI', 'Telegram Bot API', 'PostgreSQL'],
    description:
      'A Telegram-based market analysis and paper-trading system featuring automated signal monitoring and strategy analysis.',
    url: null,
    accentColor: '#ffffff',
  },
  {
    id: 'ecommerce-integration',
    number: '03',
    title: 'E-COMMERCE INTEGRATION',
    category: 'API Integration',
    year: '2024',
    tech: ['Python', 'Shopify GraphQL', 'CJdropshipping API'],
    description:
      'Integration of e-commerce systems — product discovery, API authentication, order data retrieval and automation workflows.',
    url: null,
    accentColor: '#c8f135',
  },
  {
    id: 'rag-experiments',
    number: '04',
    title: 'RAG & AI EXPERIMENTS',
    category: 'Artificial Intelligence',
    year: '2024',
    tech: ['Python', 'Embeddings', 'Vector Search', 'RAG'],
    description:
      'Experimental AI applications for contextual information retrieval and intelligent question answering.',
    url: null,
    accentColor: '#ffffff',
  },
  {
    id: 'project-05',
    number: '05',
    title: 'NEXT PROJECT',
    category: 'Coming Soon',
    year: '2025',
    tech: [],
    description: 'The next chapter is being written. Stay tuned for what comes next.',
    url: null,
    accentColor: '#c8f135',
  },
]
