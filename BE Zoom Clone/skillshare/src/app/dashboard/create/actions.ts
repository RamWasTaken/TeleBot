'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to create a course')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const image_url = formData.get('image_url') as string

  const { error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      price,
      image_url,
      instructor_id: user.id,
    })

  if (error) {
    throw new Error('Failed to create course')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
} 