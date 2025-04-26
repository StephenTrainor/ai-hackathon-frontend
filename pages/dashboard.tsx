import { useAuth } from "@/contexts/AuthContext";
import {BinaryLike, createHash} from "crypto";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
    const assignments = [
        {
            assignment_name: "Calculus Problem Set 1",
            students: ["Alice Smith", "Bob Johnson", "Charlie Brown", "Dana Lee"]
        },
        {
            assignment_name: "Biology Lab Report",
            students: ["Emma Davis", "Frank Miller"]
        },
        {
            assignment_name: "World History Essay",
            students: ["Grace Lee", "Henry Taylor", "Isabella Martinez", "Jack Anderson", "Kelly White"]
        },
        {
            assignment_name: "Python Coding Challenge",
            students: ["Liam Garcia", "Mia Rodriguez", "Noah Thomas", "Olivia Clark", "Peter Young", "Quinn Adams"]
        },
        {
            assignment_name: "Literature Analysis",
            students: ["Sophia Wilson"]
        },
        {
            assignment_name: "Physics Experiment",
            students: ["Thomas Green", "Uma Patel", "Victor Nguyen", "Wendy Liu"]
        },
        {
            assignment_name: "Statistics Assignment",
            students: ["Xander Brown", "Yara Kim", "Zoe Evans", "Aaron Scott", "Bella Wright"]
        },
        {
            assignment_name: "Creative Writing Portfolio",
            students: ["Caleb Harris", "Daisy Lopez"]
        },
        {
            assignment_name: "Chemistry Lab",
            students: ["Ethan Moore", "Fiona Chen", "George King", "Hannah Baker", "Ian Foster", "Julia Perez"]
        },
        {
            assignment_name: "Economics Case Study",
            students: ["Katherine Hall", "Lucas Rivera", "Megan Turner"]
        }
    ];

    function hash(str: BinaryLike) {
        return createHash("sha256").update(str).digest("hex");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Navbar/>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Assignments Dashboard</h1>
            {assignments.length === 0 ? (
                <p className="text-gray-500 text-center">No assignments available.</p>
            ) : (
                <div className="grid gap-6">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment.assignment_name}
                            className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">
                                    {assignment.assignment_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Students: {assignment.students.length}
                                </p>
                            </div>
                            <Link href={`/assignment/${hash(assignment.assignment_name)}`}>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
                                    View Assignment
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div>
            <div>Dashboard</div>
        </div>
    );
};
