import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: '未登录' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // 验证 slug 是否已存在
        const existing = await Post.findOne({ slug: data.slug });
        if (existing) {
            return NextResponse.json(
                { error: 'Slug 已存在，请使用其他 slug' },
                { status: 400 }
            );
        }

        const post = await Post.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('创建文章失败:', error);
        return NextResponse.json(
            { error: '创建文章失败' },
            { status: 500 }
        );
    }
}