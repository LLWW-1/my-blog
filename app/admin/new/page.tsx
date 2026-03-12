'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        published: false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert('保存失败');
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
                <h1 className="text-2xl font-bold">写新文章</h1>
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

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        只能包含字母、数字和连字符，例如：my-first-post
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
                        立即发布
                    </label>
                </div>

                {/* 提交按钮 */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                    >
                        {loading ? '保存中...' : '保存文章'}
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