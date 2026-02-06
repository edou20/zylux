import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function getTopics() {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
        .from('topics')
        .select('*')
        .eq('is_active', true)
        .order('title')
    return data || []
}

export default async function TopicsPage() {
    const topics = await getTopics()
    const aiTopics = topics.filter(t => t.niche === 'ai_tech')
    const immigrationTopics = topics.filter(t => t.niche === 'immigration')

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-display font-semibold text-slate-900">Browse Topics</h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Find discussions that match your interests
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8">
                    <button className="px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-xl">
                        All Topics
                    </button>
                    <button className="px-4 py-2 bg-white/80 text-slate-600 font-semibold rounded-xl border border-slate-200 hover:border-teal-300 hover:text-teal-700 transition">
                        AI & Tech
                    </button>
                    <button className="px-4 py-2 bg-white/80 text-slate-600 font-semibold rounded-xl border border-slate-200 hover:border-orange-300 hover:text-orange-700 transition">
                        Immigration
                    </button>
                </div>

                {/* AI & Tech Topics */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-semibold text-slate-900">AI & Technology</h2>
                            <p className="text-sm text-slate-500">{aiTopics.length} topics</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aiTopics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/topic/${topic.slug}`}
                                className="group relative bg-white/80 rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-300 card-hover"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100 to-transparent rounded-bl-[100px] rounded-tr-2xl opacity-50" />

                                <div className="relative">
                                    <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                        {topic.icon}
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                                        {topic.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                        {topic.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                                            {topic.thread_count || 0} threads
                                        </span>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Immigration Topics */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <span className="text-2xl">🌍</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-semibold text-slate-900">Immigration Hub</h2>
                            <p className="text-sm text-slate-500">{immigrationTopics.length} topics</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {immigrationTopics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/topic/${topic.slug}`}
                                className="group relative bg-white/80 rounded-2xl border border-slate-200 p-6 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 card-hover"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-[100px] rounded-tr-2xl opacity-50" />

                                <div className="relative">
                                    <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                        {topic.icon}
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                                        {topic.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                        {topic.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">
                                            {topic.thread_count || 0} threads
                                        </span>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
