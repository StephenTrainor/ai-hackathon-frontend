'use client';

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/Firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@headlessui/react';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export default function Navbar() {
    // @ts-ignore
    const { user } = useAuth();
    const router = useRouter();

    const handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    const token = credential.accessToken;
                    const user = result.user;
                    console.log(user);
                    console.log(user.toJSON());
                }
            });
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                router.push('/').then(() => {});
            })
            .catch((error) => {
                console.error('Sign out error:', error);
            });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div>
                        <Link href="/">
                            <span className="text-2xl font-bold text-gray-800">IntelliGrade</span>
                        </Link>
                    </div>
                    <div>
                        {user ? (
                            <Button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                            >
                                Sign Out
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSignIn}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
