import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch posts from Ghost Content API
    const ghostUrl = process.env.GHOST_CONTENT_URL;
    const ghostKey = process.env.GHOST_CONTENT_KEY;
    
    if (!ghostUrl || !ghostKey) {
      return NextResponse.json(
        { success: false, message: 'Ghost configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(`${ghostUrl}/ghost/api/content/posts/?key=${ghostKey}&include=tags,authors&limit=50`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ghost API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      posts: data.posts || []
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}