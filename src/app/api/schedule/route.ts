import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const IG_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!;
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const BASE = 'https://graph.facebook.com/v21.0';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { platform, placement, caption, scheduled_at, media_url } = body;

  const { data, error } = await supabase
    .from('scheduled_posts')
    .insert([{ platform, placement, caption, scheduled_at, status: 'scheduled', media_url }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, post: data[0] });
}

export async function GET() {
  const now = new Date().toISOString();

  const { data: posts } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now);

  if (!posts || posts.length === 0) return NextResponse.json({ published: 0 });

  let published = 0;

  for (const post of posts) {
    try {
      if (post.platform === 'instagram') {
        let containerId = '';

        if (post.media_url) {
          const isVideo = post.media_url.includes('.mp4') || post.media_url.includes('.mov');
          const mediaRes = await fetch(`${BASE}/${IG_ID}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...(isVideo ? { video_url: post.media_url, media_type: 'REELS' } : { image_url: post.media_url }),
              caption: post.caption,
              access_token: IG_TOKEN,
            }),
          });
          const mediaData = await mediaRes.json();
          containerId = mediaData.id;
        }

        if (containerId) {
          await fetch(`${BASE}/${IG_ID}/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creation_id: containerId, access_token: IG_TOKEN }),
          });
        }
      }

      await supabase
        .from('scheduled_posts')
        .update({ status: 'published' })
        .eq('id', post.id);

      published++;
    } catch (e) {
      console.error('Error publishing post:', e);
    }
  }

  return NextResponse.json({ published });
}
