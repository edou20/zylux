import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function TestPage() {
    const supabase = createServerSupabaseClient()

    const { data: topics, error } = await supabase
        .from('topics')
        .select('*')

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-semibold text-rose-600">❌ Error</h1>
                <p className="text-rose-500">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-semibold mb-2">✅ Database Connected!</h1>
            <p className="text-slate-600 mb-6">Found {topics?.length} topics in your Zylux.ai database</p>

            <div className="grid gap-4">
                {topics?.map((topic: any) => (
                    <div key={topic.id} className="surface card-hover p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{topic.icon}</span>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900">{topic.title}</h3>
                                <p className="text-sm text-slate-500">{topic.description}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
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
