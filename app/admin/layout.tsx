import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Plus, FileText } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/admin" className="text-xl font-bold">
                        博客管理后台
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {session.user?.email}
                        </span>
                        <Link
                            href="/admin/new"
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            写文章
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 text-sm"
                            target="_blank"
                        >
                            查看博客
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}