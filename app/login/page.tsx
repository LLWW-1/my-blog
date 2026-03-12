'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-3xl font-bold text-center">后台管理</h2>
                    <p className="mt-2 text-center text-gray-600">
                        请使用 GitHub 账号登录
                    </p>
                </div>
                <button
                    onClick={() => signIn('github', { callbackUrl: '/admin' })}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    <Github className="w-5 h-5" />
                    使用 GitHub 登录
                </button>
            </div>
        </div>
    );
}