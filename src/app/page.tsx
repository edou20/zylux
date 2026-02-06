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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            AI-Powered Community Platform
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">AI Enthusiasts</span> &
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"> Global Minds</span> Connect
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                            Join thousands discussing the latest in AI, automation, and immigration.
                            Share insights, get answers, and build your network.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all"
                            >
                                Join the Community
                            </Link>
                            <Link
                                href="/topics"
                                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
                            >
                                Explore Topics
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">10+</div>
                            <div className="text-sm text-gray-500 mt-1">Active Topics</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">1K+</div>
                            <div className="text-sm text-gray-500 mt-1">Discussions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">5K+</div>
                            <div className="text-sm text-gray-500 mt-1">Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-500 mt-1">Active Community</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Topics */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Explore Our Communities
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Dive into discussions that matter to you
                        </p>
                    </div>

                    {/* AI & Tech Section */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">AI & Technology</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {aiTopics.slice(0, 3).map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all"
                                >
                                    <div className="text-3xl mb-4">{topic.icon}</div>
                                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {topic.title}
                                    </h4>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                        {topic.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                                        <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
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
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <span className="text-xl">🌍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Immigration Hub</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {immigrationTopics.slice(0, 3).map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/topic/${topic.slug}`}
                                    className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all"
                                >
                                    <div className="text-3xl mb-4">{topic.icon}</div>
                                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {topic.title}
                                    </h4>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                        {topic.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
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
                            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
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
            <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Join the Conversation?
                    </h2>
                    <p className="text-xl text-purple-100 mb-10">
                        Connect with experts, share your knowledge, and grow together.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block px-10 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    )
}
