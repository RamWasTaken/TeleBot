import { supabase } from '@/lib/supabase'
import { Course } from '@/types/course'
import Link from 'next/link'
import Image from 'next/image'

async function getInstructorCourses(): Promise<Course[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
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
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return data
}

export default async function DashboardPage() {
  const courses = await getInstructorCourses()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <Link
          href="/dashboard/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h2>
          <p className="text-gray-600 mb-4">Create your first course to get started</p>
          <Link
            href="/dashboard/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {course.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${course.price.toFixed(2)}
                  </span>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Manage Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 