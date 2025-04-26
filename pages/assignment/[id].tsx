import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/Firebase";
import { BinaryLike, createHash } from "crypto";

const BACKEND_URL = "http://127.0.0.1:5001";

export default function Page() {
    // @ts-ignore
    const { user, loading } = useAuth();
    const router = useRouter();
    const [assignmentData, setAssignmentData] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        submission: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    function hash(str: BinaryLike) {
        return createHash("sha256").update(str).digest("hex");
    }

    async function getData() {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", user.email));
        const querySnap = await getDocs(q);

        // Check if any documents were found
        if (querySnap.empty) {
            console.error("No user found with email:", user.email);
            // Handle the case where the user document doesn't exist
            // Maybe redirect or show an error message
            await router.push("/"); // Example: redirect home
            return; // Exit the function early
        }

        const userData = querySnap.docs[0].data();
        let found = false;

        // Ensure userData.assignments exists before iterating
        if (userData.assignments && Array.isArray(userData.assignments)) {
            userData.assignments.forEach((assignment: any) => {
                if (router.query.id === hash(assignment.assignment_name)) {
                    setAssignmentData(assignment);
                    found = true;
                }
            });
        } else {
            console.error("User data does not contain an assignments array:", userData);
            // Handle missing assignments array if necessary
        }

        if (!found) {
            await router.push("/");
        }
    }

    useEffect(() => {
        if (!loading && user === null) {
            router.push("/");
        }
        if (user !== null) {
            getData();
        }
    }, [user, loading]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ email: "", name: "", submission: "" });
        setFormError(null);
        setApiError(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setApiError(null);

        // Validate form
        if (!formData.email || !formData.name || !formData.submission) {
            setFormError("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/grading/grade-submission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit data to the API.");
            }

            const result = await response.json();
            const newStudent = {
                email: formData.email,
                name: formData.name,
                grade: result.grade,
            };

            // Update assignmentData immutably
            setAssignmentData((prev: any) => ({
                ...prev,
                students: [...(prev.students || []), newStudent],
            }));

            closeModal();
        } catch (error) {
            setApiError("Error submitting data. Please try again.");
            console.error(error);
        }
    };

    if (loading || !assignmentData) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-800">
                        Assignment: {assignmentData.assignment_name}
                    </h1>
                    <button
                        onClick={openModal}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Add Student
                    </button>
                </div>
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-sm uppercase">Name</th>
                                <th className="py-4 px-6 font-semibold text-sm uppercase">Email</th>
                                <th className="py-4 px-6 font-semibold text-sm uppercase">Grade</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {assignmentData.students && assignmentData.students.length > 0 ? (
                                assignmentData.students.map((student: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-6 text-gray-800">{student.name}</td>
                                        <td className="py-4 px-6 text-gray-600">{student.email}</td>
                                        <td className="py-4 px-6 text-gray-800">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                student.grade >= 90
                                    ? "bg-green-100 text-green-800"
                                    : student.grade >= 70
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                            }`}
                        >
                          {student.grade}
                        </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="py-4 px-6 text-center text-gray-500"
                                    >
                                        No students found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                            Add New Student
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter student name"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter student email"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="submission"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Submission
                                </label>
                                <textarea
                                    id="submission"
                                    name="submission"
                                    value={formData.submission}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter student submission"
                                />
                            </div>
                            {formError && (
                                <p className="text-red-500 text-sm mb-4">{formError}</p>
                            )}
                            {apiError && (
                                <p className="text-red-500 text-sm mb-4">{apiError}</p>
                            )}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
