import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-primary">
          Page Not Found
        </h2>
        <p className="mb-6 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}