import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

async function getPosts() {
  await dbConnect();
  const posts = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toISOString(),
  }));
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">我的博客</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post._id} className="border rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <time className="text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </time>
          </article>
        ))}
      </div>
    </main>
  );
}