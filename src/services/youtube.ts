
// src/services/youtube.ts
'use server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high?: { url: string };
    };
    channelTitle: string; // Added for potential future use
  };
}

interface YouTubeVideoDetailItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high?: { url: string };
    };
    channelTitle: string;
  };
  status: {
    uploadStatus: string;
    privacyStatus: string;
    embeddable: boolean;
    madeForKids: boolean;
  };
  contentDetails: {
    duration: string; // PT#M#S format
  };
}

export async function searchAnimatedEducationalVideos(
  topic: string,
  language: 'en' | 'bn' = 'en',
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API Key is not configured.');
    throw new Error('YouTube API Key is not configured.');
  }

  const queryKeywords = [
    topic,
    language === 'bn' ? 'শিক্ষামূলক অ্যানিমেশন' : 'educational animation',
    language === 'bn' ? 'গল্প ভিত্তিক' : 'story-based',
    language === 'bn' ? 'কার্টুন' : 'cartoon',
    language === 'bn' ? 'শিক্ষার্থীদের জন্য' : 'for students',
  ];
  const searchQuery = queryKeywords.join(' ');

  const searchUrl = new URL(`${YOUTUBE_API_BASE_URL}/search`);
  searchUrl.searchParams.append('part', 'snippet');
  searchUrl.searchParams.append('q', searchQuery);
  searchUrl.searchParams.append('type', 'video');
  searchUrl.searchParams.append('videoEmbeddable', 'true');
  searchUrl.searchParams.append('videoCategoryId', '27'); // Category ID for "Education"
  searchUrl.searchParams.append('relevanceLanguage', language);
  searchUrl.searchParams.append('maxResults', String(maxResults * 2)); // Fetch more to filter later
  searchUrl.searchParams.append('key', YOUTUBE_API_KEY);

  try {
    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube API Search Error:', errorData);
      throw new Error(`YouTube API search failed: ${errorData.error?.message || searchResponse.statusText}`);
    }
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .filter((id: string | undefined) => id)
      .slice(0, maxResults * 2); // Limit IDs for details fetch

    if (videoIds.length === 0) {
      return [];
    }

    const detailsUrl = new URL(`${YOUTUBE_API_BASE_URL}/videos`);
    detailsUrl.searchParams.append('part', 'snippet,contentDetails,status');
    detailsUrl.searchParams.append('id', videoIds.join(','));
    detailsUrl.searchParams.append('key', YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsUrl.toString());
     if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json();
      console.error('YouTube API Video Details Error:', errorData);
      throw new Error(`YouTube API video details failed: ${errorData.error?.message || detailsResponse.statusText}`);
    }
    const detailsData = await detailsResponse.json();

    const verifiedVideos: YouTubeVideo[] = [];
    for (const item of detailsData.items as YouTubeVideoDetailItem[]) {
      if (
        item.status.uploadStatus === 'processed' &&
        item.status.privacyStatus === 'public' &&
        item.status.embeddable &&
        !item.status.madeForKids // "Made for Kids" videos often have embedding restrictions
      ) {
        verifiedVideos.push({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description.substring(0, 150) + (item.snippet.description.length > 150 ? '...' : ''), // Truncate description
          thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.id}`,
        });
      }
      if (verifiedVideos.length >= maxResults) break;
    }

    return verifiedVideos;
  } catch (error) {
    console.error('Error fetching from YouTube:', error);
    // Return empty array or throw a more specific error for the flow to handle
    return [];
  }
}
