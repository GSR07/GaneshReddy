export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  tags: string[]
  badges: string[]
  image_url?: string
  video_url?: string
  youtube_id?: string
  github_url?: string
  demo_url?: string
  blog_url?: string
  featured: boolean
  sort_order: number
  visual_class?: string
  highlights?: { icon: string; title: string; desc: string }[]
  concepts?: string[]
  specs?: { label: string; value: string }[]
  created_at: string
  updated_at: string
}

export interface SkillItem {
  name: string
  level: number
  hot?: boolean
}

export interface SkillGroup {
  id: string
  category: string
  card_class?: string
  items: SkillItem[]
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  badge: string
  badge_type: 'research' | 'industry' | 'intern'
  title: string
  organization: string
  period: string
  bullets: string[]
  sort_order: number
  created_at: string
}

export interface Education {
  id: string
  degree: string
  university: string
  location: string
  period: string
  gpa?: string
  ects?: string
  coursework: string[]
  thesis?: string
  sort_order: number
  created_at: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url?: string
  image_url?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  image_url?: string
  featured: boolean
  sort_order: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
  image_url?: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}
