import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function PUT(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: '未登录' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // 不允许修改 slug
        delete data.slug;
        delete data._id;

        const post = await Post.findOneAndUpdate(
            { slug: params.slug },
            {
                ...data,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: '文章不存在' }, { status: 404 });
        }

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('更新文章失败:', error);
        return NextResponse.json(
            { error: '更新文章失败' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: '未登录' }, { status: 401 });
        }

        await dbConnect();
        const result = await Post.deleteOne({ slug: params.slug });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: '文章不存在' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('删除文章失败:', error);
        return NextResponse.json(
            { error: '删除文章失败' },
            { status: 500 }
        );
    }
}