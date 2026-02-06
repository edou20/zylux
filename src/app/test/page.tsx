import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function TestPage() {
    const supabase = createServerSupabaseClient()

    const { data: topics, error } = await supabase
        .from('topics')
        .select('*')

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">❌ Error</h1>
                <p className="text-red-500">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">✅ Database Connected!</h1>
            <p className="text-gray-600 mb-6">Found {topics?.length} topics in your Zylux.ai database</p>

            <div className="grid gap-4">
                {topics?.map((topic: any) => (
                    <div key={topic.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{topic.icon}</span>
                            <div>
                                <h3 className="font-semibold text-lg">{topic.title}</h3>
                                <p className="text-sm text-gray-500">{topic.description}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                    {topic.niche === 'ai_tech' ? 'AI & Tech' : 'Immigration'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
