'use client';  // 添加这一行，因为需要交互

import Link from 'next/link';
import { useRouter } from 'next/navigation';  // 添加
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';  // 添加

interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    published: boolean;
    createdAt: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // 获取文章列表
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('获取文章失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 删除文章
    const handleDelete = async (slug: string) => {
        if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/posts/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // 重新获取列表
                fetchPosts();
            } else {
                alert('删除失败');
            }
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败');
        }
    };

    if (loading) {
        return <div className="text-center py-8">加载中...</div>;
    }

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
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> 删除
                                        </button>
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