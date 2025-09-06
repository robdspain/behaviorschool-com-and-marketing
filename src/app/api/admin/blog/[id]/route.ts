import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch specific post from Ghost Content API
    const ghostUrl = process.env.GHOST_CONTENT_URL;
    const ghostKey = process.env.GHOST_CONTENT_KEY;
    
    if (!ghostUrl || !ghostKey) {
      return NextResponse.json(
        { success: false, message: 'Ghost configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(`${ghostUrl}/ghost/api/content/posts/${id}/?key=${ghostKey}&include=tags,authors`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Post not found' },
          { status: 404 }
        );
      }
      throw new Error(`Ghost API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      post: data.posts?.[0] || null
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}