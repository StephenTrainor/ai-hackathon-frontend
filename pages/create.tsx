'use client';

import {BinaryLike, createHash} from 'crypto';
import {Button, Input, Field, Textarea, Description, Label} from "@headlessui/react";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {db} from "@/Firebase";
import {collection, getDocs, updateDoc, query, where, doc} from "firebase/firestore";
import {useAuth} from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";

export default function Create() {
    const [rubric, setRubric] = React.useState<string>("");
    const [solution, setSolution] = React.useState<string>("");
    const [assignmentName, setAssignmentName] = React.useState<string>("");
    const router = useRouter();
    // @ts-ignore
    const {user, loading} = useAuth();

    const handleRubricChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRubric(event.target.value);
    }

    const handleSolutionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSolution(event.target.value);
    }

    const handleAssignmentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAssignmentName(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("email", "==", user.email));
            const querySnap = await getDocs(q);
            const userData = querySnap.docs[0].data();
            const assignments = userData.assignments;
            assignments.push({
                "assignment_name": assignmentName,
                "rubric": rubric,
                "solution": solution,
                "students": []
            });

            const userDocumentRef = doc(db, "users", userData.user_id);
            await updateDoc(userDocumentRef, {
                ...userData,
                assignments: assignments
            });

            function hash(str: BinaryLike) {
                return createHash("sha256").update(str).digest("hex");
            }

            await router.push(`/assignment/${hash(assignmentName)}`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!loading && user === null) {
            router.push("/").then(r => {});
        }
    }, [])

    if (loading) {
        return (
            <Loading />
        );
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Navbar/>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Assignment</h2>
            <div className="space-y-6">
                <Field>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</Label>
                    <Input
                        autoComplete="off"
                        name="assignmentName"
                        onChange={handleAssignmentNameChange}
                        type="text"
                        value={assignmentName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                </Field>
                <Field>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Rubric</Label>
                    <Description className="text-sm text-gray-500 mb-2">Enter the grading rubric to be used on this assignment</Description>
                    <Textarea
                        autoComplete="off"
                        id="rubric"
                        value={rubric}
                        onChange={handleRubricChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[100px]"
                    />
                </Field>
                <Field>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Solutions</Label>
                    <Description className="text-sm text-gray-500 mb-2">Enter the solutions for the assignment</Description>
                    <Textarea
                        autoComplete="off"
                        id="solution"
                        value={solution}
                        onChange={handleSolutionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[100px]"
                    />
                </Field>
                <Button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                    Create
                </Button>
            </div>
        </div>
    );
};
