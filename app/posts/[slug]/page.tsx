// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import PostDetail from '@/app/components/Postdetail';
import { postsApi } from '@/app/lib/api/posts';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const post = await postsApi.getPostBySlug(params.slug);
    
    return {
      title: `${post.title} | Tin tức`,
      description: post.excerpt || post.content?.substring(0, 160) + '...',
      keywords: post.tags?.join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImageUrl ? [post.featuredImageUrl] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.authorName],
      },
    };
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: PageProps) {
  try {
    const post = await postsApi.getPostBySlug(params.slug);
    
    if (!post) {
      notFound();
    }
    
    // Lấy bài viết liên quan
    const relatedPosts = await postsApi.getRelatedPosts(params.slug, 5);
    
    return <PostDetail post={post as any} relatedPosts={relatedPosts as any} />;
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}