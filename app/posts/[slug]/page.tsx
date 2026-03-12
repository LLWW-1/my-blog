import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return {
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt?.toISOString(),
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <time className="text-gray-400 block mb-8">
                {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </time>
            <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}