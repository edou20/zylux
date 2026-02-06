'use server'

// AI Service for Thread Summarization and Script Generation
// Uses OpenAI API for content generation

interface SummarizeOptions {
    threadTitle: string
    threadContent: string
    comments: Array<{ author: string; content: string }>
    maxLength?: number
}

interface GenerateScriptOptions {
    threadTitle: string
    threadContent: string
    comments: Array<{ author: string; content: string }>
    platform: 'tiktok' | 'reels' | 'shorts' | 'youtube'
    style: 'educational' | 'entertaining' | 'controversial' | 'storytelling'
}

interface AIResponse {
    success: boolean
    content?: string
    error?: string
}

// Mock AI responses for now (replace with OpenAI when API key is available)
export async function summarizeThread(options: SummarizeOptions): Promise<AIResponse> {
    const { threadTitle, threadContent, comments, maxLength = 280 } = options

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate a smart summary based on content
    const commentHighlights = comments.slice(0, 3).map(c => c.content.slice(0, 50)).join('; ')

    const summary = `🧵 ${threadTitle.slice(0, 60)}${threadTitle.length > 60 ? '...' : ''}\n\n` +
        `${threadContent.slice(0, 100)}...\n\n` +
        `💬 Top insights: ${commentHighlights}\n\n` +
        `📊 ${comments.length} comments in this discussion`

    return {
        success: true,
        content: summary.slice(0, maxLength)
    }
}

export async function generateScript(options: GenerateScriptOptions): Promise<AIResponse> {
    const { threadTitle, threadContent, comments, platform, style } = options

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Platform-specific formatting
    const platformConfig = {
        tiktok: { maxDuration: 60, format: 'vertical', hook: '🔥' },
        reels: { maxDuration: 90, format: 'vertical', hook: '👀' },
        shorts: { maxDuration: 60, format: 'vertical', hook: '💡' },
        youtube: { maxDuration: 600, format: 'horizontal', hook: '🎬' }
    }

    const config = platformConfig[platform]

    // Generate script structure
    const scriptParts = [
        `${config.hook} HOOK (0-3 seconds):`,
        `"${threadTitle.slice(0, 50)}... Let me explain."`,
        '',
        '📝 SETUP (3-15 seconds):',
        `"${threadContent.slice(0, 150)}..."`,
        '',
        '💡 KEY POINTS (15-45 seconds):'
    ]

    // Add top comment insights
    comments.slice(0, 3).forEach((comment, i) => {
        scriptParts.push(`${i + 1}. "${comment.content.slice(0, 80)}..."`)
    })

    scriptParts.push('')
    scriptParts.push('🎯 CTA (last 5 seconds):')
    scriptParts.push('"Follow for more discussions like this. Drop a comment with your thoughts!"')
    scriptParts.push('')
    scriptParts.push(`---`)
    scriptParts.push(`Platform: ${platform.toUpperCase()}`)
    scriptParts.push(`Style: ${style}`)
    scriptParts.push(`Max Duration: ${config.maxDuration}s`)

    return {
        success: true,
        content: scriptParts.join('\n')
    }
}

export async function analyzeContentTone(content: string): Promise<{
    tone: 'positive' | 'negative' | 'neutral' | 'controversial'
    confidence: number
}> {
    // Simple tone analysis (would use AI in production)
    const lowerContent = content.toLowerCase()

    const positiveWords = ['great', 'amazing', 'love', 'excellent', 'helpful', 'thanks']
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'wrong', 'stupid']
    const controversialWords = ['disagree', 'debate', 'controversial', 'unpopular', 'opinion']

    let positiveScore = 0
    let negativeScore = 0
    let controversialScore = 0

    positiveWords.forEach(word => {
        if (lowerContent.includes(word)) positiveScore++
    })

    negativeWords.forEach(word => {
        if (lowerContent.includes(word)) negativeScore++
    })

    controversialWords.forEach(word => {
        if (lowerContent.includes(word)) controversialScore++
    })

    const maxScore = Math.max(positiveScore, negativeScore, controversialScore)

    if (maxScore === 0) {
        return { tone: 'neutral', confidence: 0.5 }
    }

    if (controversialScore === maxScore) {
        return { tone: 'controversial', confidence: Math.min(0.9, 0.5 + controversialScore * 0.1) }
    }

    if (positiveScore > negativeScore) {
        return { tone: 'positive', confidence: Math.min(0.9, 0.5 + positiveScore * 0.1) }
    }

    if (negativeScore > positiveScore) {
        return { tone: 'negative', confidence: Math.min(0.9, 0.5 + negativeScore * 0.1) }
    }

    return { tone: 'neutral', confidence: 0.6 }
}
