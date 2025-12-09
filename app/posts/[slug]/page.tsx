// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/app/lib/api/posts';
import PostDetail from '@/app/components/Postdetail';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return null;
    
    return {
      title: `${post.title} | Tin tức`,
      description: post.excerpt || post.content?.substring(0, 160) + '...',
      keywords: post.tags?.map(tag => tag.name).join(', '),
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
    // Lấy bài viết chính
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      notFound();
    }
    
    // Lấy bài viết liên quan (cùng category hoặc tags)
    const relatedPosts = await getRelatedPosts(params.slug);
    
    return <PostDetail post={post} relatedPosts={relatedPosts} />;
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}