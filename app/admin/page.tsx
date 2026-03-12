import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { Edit, Eye } from 'lucide-react';

async function getPosts() {
    await dbConnect();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt?.toISOString(),
    }));
}

export default async function AdminPage() {
    const posts = await getPosts();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">文章管理</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布时间</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                    <div className="text-sm text-gray-500">/{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${post.published
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {post.published ? '已发布' : '草稿'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/edit/${post.slug}`}
                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> 编辑
                                        </Link>
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            target="_blank"
                                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" /> 查看
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}