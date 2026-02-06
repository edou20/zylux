import { NextRequest, NextResponse } from 'next/server'
import { generateScript } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { threadTitle, threadContent, comments, platform, style } = body

        if (!threadTitle || !threadContent || !platform) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const validPlatforms = ['tiktok', 'reels', 'shorts', 'youtube']
        const validStyles = ['educational', 'entertaining', 'controversial', 'storytelling']

        if (!validPlatforms.includes(platform)) {
            return NextResponse.json(
                { success: false, error: 'Invalid platform' },
                { status: 400 }
            )
        }

        const result = await generateScript({
            threadTitle,
            threadContent,
            comments: comments || [],
            platform,
            style: validStyles.includes(style) ? style : 'educational'
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Script generation error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate script' },
            { status: 500 }
        )
    }
}
