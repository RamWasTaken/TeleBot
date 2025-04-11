import { supabase } from '@/lib/supabase'
import { createLesson } from '../actions'
import Link from 'next/link'

async function getCourse(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', id)
    .eq('instructor_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data
}

export default async function NewLessonPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <p className="text-gray-600 mt-2">The course you're looking for doesn't exist or you don't have permission to access it.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Lesson</h1>
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          Back to Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form action={createLesson} className="space-y-6">
            <input type="hidden" name="course_id" value={course.id} />
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Lesson Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Lesson Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                Lesson Order
              </label>
              <input
                type="number"
                name="order"
                id="order"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 