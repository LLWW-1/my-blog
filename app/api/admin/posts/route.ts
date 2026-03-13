import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// 处理 GET 请求（获取文章列表）
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: '未登录' }, { status: 401 });
        }

        await dbConnect();
        const posts = await Post.find().sort({ createdAt: -1 }).lean();

        const formattedPosts = posts.map(post => ({
            ...post,
            _id: post._id.toString(),
            createdAt: post.createdAt?.toISOString(),
        }));

        return NextResponse.json(formattedPosts);
    } catch (error) {
        console.error('获取文章失败:', error);
        return NextResponse.json(
            { error: '获取文章失败' },
            { status: 500 }
        );
    }
}

// 处理 POST 请求（新建文章）
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