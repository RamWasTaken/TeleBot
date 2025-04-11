# SkillShare Clone

A modern e-learning platform built with Next.js, Supabase, and Tailwind CSS.

## Features

- Course listing and detail pages
- User authentication
- Course enrollment
- Instructor dashboard
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS
- React Hook Form
- Zod

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a new Supabase project
2. Run the SQL migration in `supabase/migrations/20240320000000_create_courses_tables.sql`
3. Enable the following Supabase features:
   - Authentication
   - Database
   - Storage

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── courses/           # Course-related pages
│   ├── dashboard/         # Instructor dashboard
│   └── auth/              # Authentication pages
├── components/            # Reusable components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
