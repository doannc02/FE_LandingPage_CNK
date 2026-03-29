// app/lib/api/posts.server.ts
import { PostDetailDto, RelatedPostDto } from "./posts";
import https from "https";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:52040";

// ✅ Tạo agent để bypass SSL verification (chỉ dùng cho dev)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Bypass self-signed certificate
});

/**
 * Server-side API calls cho Server Components
 */

export async function getPostBySlugServer(
  slug: string,
): Promise<PostDetailDto | null> {
  try {
    const url = `${API_BASE_URL}/posts/slug/${slug}`;
    console.log("🔍 Fetching post from:", url);

    const response = await fetch(url, {
      next: {
        revalidate: 60,
      },
      headers: {
        "Content-Type": "application/json",
      },
      // ✅ Thêm agent để bypass SSL
      ...(url.startsWith("https") ? { agent: httpsAgent } : {}),
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      console.error(
        `❌ Failed to fetch post: ${response.status} ${response.statusText}`,
      );
      const errorText = await response.text();
      console.error("Error body:", errorText);
      return null;
    }

    const result = await response.json();
    console.log(
      "✅ Response received:",
      result.success || result.isSuccess ? "Success" : "Failed",
    );

    if ((result.success || result.isSuccess) && result.data) {
      return result.data;
    }

    console.error("❌ Invalid response format:", result);
    return null;
  } catch (error) {
    console.error("❌ Error fetching post by slug:", error);
    return null;
  }
}

export async function getRelatedPostsServer(
  slug: string,
  limit: number = 5,
): Promise<RelatedPostDto[]> {
  try {
    const url = `${API_BASE_URL}/posts/${slug}/related?limit=${limit}`;
    console.log("🔍 Fetching related posts from:", url);

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
      ...(url.startsWith("https") ? { agent: httpsAgent } : {}),
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch related posts: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if ((result.success || result.isSuccess) && result.data) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error("❌ Error fetching related posts:", error);
    return [];
  }
}
