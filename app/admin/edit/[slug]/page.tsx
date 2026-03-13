import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import EditPostForm from './EditPostForm';

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug }).lean();
    if (!post) return null;
    return {
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt?.toISOString(),
    };
}

export default async function EditPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const session = await getServerSession();
    if (!session) {
        redirect('/login');
    }

    const post = await getPost(params.slug);
    if (!post) {
        redirect('/admin');
    }

    return <EditPostForm post={post} />;
}