'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCourse(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to update a course')
  }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const image_url = formData.get('image_url') as string

  const { error } = await supabase
    .from('courses')
    .update({
      title,
      description,
      price,
      image_url,
    })
    .eq('id', id)
    .eq('instructor_id', user.id)

  if (error) {
    throw new Error('Failed to update course')
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/courses/${id}`)
}

export async function deleteCourse(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to delete a course')
  }

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
    .eq('instructor_id', user.id)

  if (error) {
    throw new Error('Failed to delete course')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteLesson(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to delete a lesson')
  }

  const id = formData.get('id') as string

  // First, verify that the lesson belongs to a course owned by the user
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', id)
    .single()

  if (lessonError || !lesson) {
    throw new Error('Lesson not found')
  }

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .eq('id', lesson.course_id)
    .eq('instructor_id', user.id)
    .single()

  if (courseError || !course) {
    throw new Error('You do not have permission to delete this lesson')
  }

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete lesson')
  }

  revalidatePath(`/dashboard/courses/${course.id}`)
} 