'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLesson(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to create a lesson')
  }

  const course_id = formData.get('course_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const order = parseInt(formData.get('order') as string)

  // Verify that the course belongs to the user
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .eq('id', course_id)
    .eq('instructor_id', user.id)
    .single()

  if (courseError || !course) {
    throw new Error('You do not have permission to add lessons to this course')
  }

  const { error } = await supabase
    .from('lessons')
    .insert({
      course_id,
      title,
      description,
      order,
    })

  if (error) {
    throw new Error('Failed to create lesson')
  }

  revalidatePath(`/dashboard/courses/${course_id}`)
  redirect(`/dashboard/courses/${course_id}`)
}

export async function updateLesson(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to update a lesson')
  }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const order = parseInt(formData.get('order') as string)

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
    throw new Error('You do not have permission to update this lesson')
  }

  const { error } = await supabase
    .from('lessons')
    .update({
      title,
      description,
      order,
    })
    .eq('id', id)

  if (error) {
    throw new Error('Failed to update lesson')
  }

  revalidatePath(`/dashboard/courses/${course.id}`)
  redirect(`/dashboard/courses/${course.id}`)
} 