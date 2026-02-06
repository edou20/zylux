import { NextRequest, NextResponse } from 'next/server'
import { summarizeThread } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { threadTitle, threadContent, comments } = body

        if (!threadTitle || !threadContent) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const result = await summarizeThread({
            threadTitle,
            threadContent,
            comments: comments || [],
            maxLength: 500
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Summarization error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate summary' },
            { status: 500 }
        )
    }
}
