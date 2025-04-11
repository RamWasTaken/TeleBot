import { supabase } from '@/lib/supabase'
import { Course } from '@/types/course'
import Image from 'next/image'
import Link from 'next/link'
import { updateCourse } from './actions'
import { deleteCourse } from './actions'

async function getCourse(id: string): Promise<Course | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (
        id,
        title,
        description,
        order
      )
    `)
    .eq('id', id)
    .eq('instructor_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data
}

export default async function CourseManagementPage({ params }: { params: { id: string } }) {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Course</h1>
        <div className="space-x-4">
          <Link
            href={`/dashboard/courses/${course.id}/lessons/new`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Lesson
          </Link>
          <form action={deleteCourse}>
            <input type="hidden" name="id" value={course.id} />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Course
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {course.image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <form action={updateCourse} className="space-y-6">
            <input type="hidden" name="id" value={course.id} />
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                defaultValue={course.title}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                defaultValue={course.description}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  defaultValue={course.price}
                  required
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Course Image URL
              </label>
              <input
                type="url"
                name="image_url"
                id="image_url"
                defaultValue={course.image_url || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons</h2>
          {course.lessons.length === 0 ? (
            <p className="text-gray-600">No lessons yet. Add your first lesson to get started.</p>
          ) : (
            <div className="space-y-4">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <form action={deleteLesson}>
                      <input type="hidden" name="id" value={lesson.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 