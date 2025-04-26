'use client';

import { useRouter } from "next/router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/Firebase";
import { Button } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";

const provider = new GoogleAuthProvider();

export default function Home() {
    const router = useRouter();
    // @ts-ignore
    const { user, loading } = useAuth();

    const signIn = () => {
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

    if (loading) {
        return <Loading />;
    }

    if (user === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <Navbar/>
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">IntelliGrade</h1>
                    <p className="text-gray-600 mb-6">
                        Sign in to access your assignments and manage your academic tasks.
                    </p>
                    <Button
                        onClick={signIn}
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        Sign In with Google
                    </Button>
                </div>
            </div>
        );
    } else {
        router.push("/dashboard").then(() => {});
        return null;
    }
}
