import { supabase } from '@/lib/supabase'
import { Course } from '@/types/course'
import Image from 'next/image'

async function getCourse(id: string): Promise<Course | null> {
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
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <p className="text-gray-600 mt-2">The course you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
            <ul className="space-y-2">
              {course.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    {lesson.order}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              ${course.price.toFixed(2)}
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 