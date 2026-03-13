'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published: boolean;
}

export default function EditPostForm({ post }: { post: Post }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        published: post.published,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/posts/${post.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || '保存失败');
            }
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">编辑文章</h1>
                <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900"
                >
                    返回
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 标题 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        标题 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Slug - 编辑时通常不允许改，可以显示但禁用 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (URL)
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Slug 不可修改
                    </p>
                </div>

                {/* 内容 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        内容 (支持 Markdown) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        required
                        rows={15}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                </div>

                {/* 摘要 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        摘要 (可选)
                    </label>
                    <textarea
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 发布状态 */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        已发布
                    </label>
                </div>

                {/* 提交按钮 */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                    >
                        {loading ? '保存中...' : '保存修改'}
                    </button>
                    <Link
                        href="/admin"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        取消
                    </Link>
                </div>
            </form>
        </div>
    );
}