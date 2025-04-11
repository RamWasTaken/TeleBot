export type Course = {
  id: string
  title: string
  description: string
  instructor_id: string
  created_at: string
  updated_at: string
  price: number
  image_url?: string
  lessons: {
    id: string
    title: string
    description: string
    order: number
  }[]
} 