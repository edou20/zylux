import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

async function getTopics() {
    const { data } = await supabase
        .from('topics')
        .select('*')
        .eq('is_active', true)
        .limit(6)
    return data || []
}

export default async function HomePage() {
    const topics = await getTopics()
    const aiTopics = topics.filter(t => t.niche === 'ai_tech')
    const immigrationTopics = topics.filter(t => t.niche === 'immigration')

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh" />
                <div className="absolute inset-0 bg-noise opacity-60" />
                <div className="absolute -top-24 right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-floaty" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-floaty" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
                        <div className="text-left">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-200 text-slate-700 rounded-full text-sm font-semibold mb-6 shadow-sm animate-fade-up">
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                                AI-Powered Community Platform
                            </span>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold text-slate-900 leading-[1.05] tracking-tight animate-fade-up-2">
                                Where bold ideas in
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500"> AI</span>
                                <br className="hidden sm:block" /> and global mobility connect.
                            </h1>
                            <p className="mt-6 text-xl text-slate-600 max-w-2xl text-balance animate-fade-up-3">
                                Join thousands discussing AI, automation, and immigration. Share insights, get answers,
                                and build your network with people moving the world forward.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/signup"
                                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all"
                                >
                                    Join the Community
                                </Link>
                                <Link
                                    href="/topics"
                                    className="px-8 py-4 bg-white/80 text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-teal-300 hover:text-teal-700 transition-all"
                                >
                                    Explore Topics
                                </Link>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">Expert AMAs</span>
                                <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">Curated Threads</span>
                                <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">Private Bookmarks</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-6 shadow-xl shadow-slate-900/10">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-slate-500">Today on Zylux</p>
                                        <h3 className="text-2xl font-display font-semibold text-slate-900">Community Pulse</h3>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-700">Live</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                                        <p className="text-sm text-slate-500">Most active topic</p>
                                        <p className="text-lg font-semibold text-slate-900">AI in Healthcare Ethics</p>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                                        <p className="text-sm text-slate-500">Trending question</p>
                                        <p className="text-lg font-semibold text-slate-900">O-1 vs EB-1: what to know right now</p>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                                        <p className="text-sm text-slate-500">Newest discussion</p>
                                        <p className="text-lg font-semibold text-slate-900">Building reliable AI agents at scale</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 shadow-lg shadow-orange-500/30" />
                            <div className="absolute -top-8 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/30" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Active Topics', value: '10+' },
                            { label: 'Discussions', value: '1K+' },
                            { label: 'Members', value: '5K+' },
                            { label: 'Always On', value: '24/7' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 text-center shadow-sm"
                            >
                                <div className="text-3xl font-display font-semibold text-slate-900">{stat.value}</div>
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Topics */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">
                            Explore Our Communities
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Dive into discussions that matter to you
                        </p>
                    </div>

                    {/* AI & Tech Section */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
                                <span className="text-xl">🤖</span>
                            </div>
                            <h3 className="text-2xl font-display font-semibold text-slate-900">AI & Technology</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {aiTopics.slice(0, 3).map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="group p-6 bg-white/80 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all"
                                >
                                    <div className="text-3xl mb-4">{topic.icon}</div>
                                    <h4 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                                        {topic.title}
                                    </h4>
                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                        {topic.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                        <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full">
                                            {topic.thread_count || 0} threads
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Immigration Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                                <span className="text-xl">🌍</span>
                            </div>
                            <h3 className="text-2xl font-display font-semibold text-slate-900">Immigration Hub</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {immigrationTopics.slice(0, 3).map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="group p-6 bg-white/80 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all"
                                >
                                    <div className="text-3xl mb-4">{topic.icon}</div>
                                    <h4 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                                        {topic.title}
                                    </h4>
                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                        {topic.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                                            {topic.thread_count || 0} threads
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/topics"
                            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 transition-colors"
                        >
                            View All Topics
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-600 to-orange-400 p-10 sm:p-14 text-center text-white shadow-xl shadow-teal-500/25">
                        <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-4">
                            Ready to Join the Conversation?
                        </h2>
                        <p className="text-lg text-white/85 mb-8">
                            Connect with experts, share your knowledge, and grow together.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block px-10 py-4 bg-white text-slate-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
