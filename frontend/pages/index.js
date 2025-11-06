import Hero from '../themes/classic/components/Hero'

export default function Home() {
  return (
    <main>
      <Hero title="Welcome to School CMS" subtitle="Lightweight K12 CMS for Nigerian schools" />
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-semibold">Latest Posts</h2>
        <p className="mt-2 text-gray-600">Public posts will appear here.</p>
      </div>
    </main>
  )
}
