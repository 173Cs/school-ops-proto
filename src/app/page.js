"use client"
import React, { useState, useEffect } from 'react';
import { CSVUpload } from './components/Csvupload';
import { Filters } from './components/Filters';
import { AttendanceTrendChart } from './components/Attendance';
import { AvgScoreBySubjectChart } from './components/SubjectChart';
import { AtRiskTable } from './components/Risktable';
import { KPICard } from './components/Kpicard';

// --- Mock Data ---
const MOCK_STUDENTS = [
    { id: '1', name: 'Alice Smith', class: '10A', email: 'alice.s@school.com', gender: 'female' },
    { id: '2', name: 'Bob Johnson', class: '10B', email: 'bob.j@school.com', gender: 'male' },
    { id: '3', name: 'Charlie Brown', class: '10A', email: 'charlie.b@school.com', gender: 'male' },
    { id: '4', name: 'Diana Prince', class: '10C', email: 'diana.p@school.com', gender: 'female' },
    { id: '5', name: 'Ethan Hunt', class: '10B', email: 'ethan.h@school.com', gender: 'male' },
];

const MOCK_ATTENDANCE = [
    { date: '2023-10-10', studentId: '1', status: 'present' },
    { date: '2023-10-10', studentId: '2', status: 'present' },
    { date: '2023-10-10', studentId: '3', status: 'absent' },
    { date: '2023-10-11', studentId: '1', status: 'present' },
    { date: '2023-10-11', studentId: '2', status: 'absent' },
    { date: '2023-10-11', studentId: '3', status: 'present' },
    { date: '2023-10-12', studentId: '1', status: 'present' },
    { date: '2023-10-12', studentId: '2', status: 'present' },
    { date: '2023-10-12', studentId: '3', status: 'present' },
    { date: '2023-10-13', studentId: '1', status: 'present' },
    { date: '2023-10-13', studentId: '2', status: 'absent' },
    { date: '2023-10-13', studentId: '3', status: 'present' },
];

const MOCK_ASSESSMENTS = [
    { studentId: '1', subject: 'Math', score: 92, term: 'Q1' },
    { studentId: '2', subject: 'Math', score: 75, term: 'Q1' },
    { studentId: '3', subject: 'Math', score: 60, term: 'Q1' },
    { studentId: '1', subject: 'Science', score: 88, term: 'Q1' },
    { studentId: '2', subject: 'Science', score: 80, term: 'Q1' },
    { studentId: '3', subject: 'Science', score: 70, term: 'Q1' },
    { studentId: '1', subject: 'English', score: 85, term: 'Q1' },
    { studentId: '2', subject: 'English', score: 78, term: 'Q1' },
    { studentId: '3', subject: 'English', score: 65, term: 'Q1' },
    { studentId: '1', subject: 'History', score: 90, term: 'Q1' },
    { studentId: '2', subject: 'History', score: 82, term: 'Q1' },
    { studentId: '3', subject: 'History', score: 72, term: 'Q1' },
];

const MOCK_NOTICE_BOARD = [
    { title: 'Sports Day Announcement', date: 'May 12, 2024', content: 'The school\'s Annual Sports Day will be held on May 12, 2024. Mark your calendars!' },
    { title: 'Summer Break Start Date', date: 'May 20, 2024', content: 'Summer break begins on May 20, 2024. Have a wonderful holiday!' },
];

const MOCK_MESSAGES = [
    { id: 1, sender: 'Jane Cooper', content: 'Don\'t forget the lab report...', time: '12:34 PM' },
    { id: 2, sender: 'Kristin Watson', content: 'Do we have maths test...', time: '12:34 PM' },
    { id: 3, sender: 'Jenny Wilson', content: 'What?', time: '12:34 PM' },
    { id: 4, sender: 'Brooklyn Sim', content: 'Did Sachin give any ki...', time: '12:34 PM' },
    { id: 5, sender: 'Darrell Steward', content: 'Can we go for a movie...', time: '12:34 PM' },
];

const MOCK_USERS = {};
const MOCK_DEMO_USERS = {
    admin: { email: 'admin@school.com', password: 'admin', role: 'admin' },
    teacher: { email: 'teacher@school.com', password: 'teacher', role: 'teacher' },
    student: { email: 'student@school.com', password: 'student', role: 'student' }
};


const App = () => {
    const [view, setView] = useState('login');
    const [activePage, setActivePage] = useState('Dashboard');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [classFilter, setClassFilter] = useState('all');
    const [termFilter, setTermFilter] = useState('all');

    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleSignup = (e) => {
        e.preventDefault();

        const { email, password, 'confirm-password': confirmPassword, 'phone-number': phoneNumber, role } = Object.fromEntries(new FormData(e.target));

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", 'error');
            return;
        }

        if (MOCK_USERS[email]) {
            showMessage("A user with this email already exists.", 'error');
            return;
        }

        MOCK_USERS[email] = { email, password, phoneNumber, role };
        setUser({ email, role, phoneNumber });
        setRole(role);
        showMessage("Signup successful! You are now logged in.", 'success');
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));
        const storedUser = MOCK_USERS[email] || MOCK_DEMO_USERS[email];

        if (storedUser && storedUser.password === password) {
            setUser({ email: storedUser.email, role: storedUser.role });
            setRole(storedUser.role);
            showMessage("Login successful!", 'success');
        } else {
            showMessage("Invalid email or password.", 'error');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setRole(null);
        setActivePage('Dashboard');
        showMessage("You have been logged out.", 'info');
    };

    const handleDemoLogin = (demoRole) => {
        const user = MOCK_DEMO_USERS[demoRole];
        if (user) {
            setUser({ email: user.email, role: user.role });
            setRole(user.role);
            showMessage(`Logged in as ${demoRole}.`, 'success');
        } else {
            showMessage(`Could not find demo user for role: ${demoRole}`, 'error');
        }
    };

    const handleAddStudent = (newStudentData) => {
        const newId = (MOCK_STUDENTS.length + 1).toString();
        const newStudent = { id: newId, ...newStudentData };
        MOCK_STUDENTS.push(newStudent);
        setShowAddStudentForm(false);
        showMessage("New student added successfully!", 'success');
    };

    const handleCSVUpload = (type, filename) => {
        showMessage(`${type} CSV uploaded successfully: ${filename}`, 'success');
    };

    const handleFilterChange = (filters) => {
        setClassFilter(filters.class);
        setTermFilter(filters.term);
    };

    const handleExportAtRisk = () => {
        showMessage("At-risk students data exported successfully", 'success');
    };

    const calculateKPIs = () => {
        // Calculate attendance percentage
        const totalAttendanceRecords = MOCK_ATTENDANCE.length;
        const presentRecords = MOCK_ATTENDANCE.filter(a => a.status === 'present').length;
        const attendancePercentage = totalAttendanceRecords > 0 
            ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
            : 0;

        // Calculate average score for latest term
        const latestTerm = 'Q1'; // In a real app, this would be dynamic
        const termScores = MOCK_ASSESSMENTS
            .filter(a => a.term === latestTerm)
            .map(a => a.score);
        const avgScore = termScores.length > 0 
            ? Math.round(termScores.reduce((sum, score) => sum + score, 0) / termScores.length)
            : 0;

        // Calculate at-risk count
        const atRiskStudents = getAtRiskStudents();
        const atRiskCount = atRiskStudents.length;

        return { attendancePercentage, avgScore, atRiskCount };
    };

    const getAtRiskStudents = () => {
        const attendanceMap = MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: { present: 0, total: 0 } }), {});
        MOCK_ATTENDANCE.forEach(a => {
            if (attendanceMap[a.studentId]) {
                attendanceMap[a.studentId].total++;
                if (a.status === 'present') {
                    attendanceMap[a.studentId].present++;
                }
            }
        });

        const atRisk = MOCK_STUDENTS.filter(student => {
            const studentScores = MOCK_ASSESSMENTS.filter(a => a.studentId === student.id && a.term === 'Q1');
            const avgStudentScore = studentScores.length ? studentScores.reduce((sum, s) => sum + s.score, 0) / studentScores.length : 0;
            const studentAttendance = attendanceMap[student.id];
            const attendancePercentage = studentAttendance.total ? (studentAttendance.present / studentAttendance.total) * 100 : 100;

            return avgStudentScore < 70 || attendancePercentage < 80;
        }).map(student => {
            const studentScores = MOCK_ASSESSMENTS.filter(a => a.studentId === student.id && a.term === 'Q1');
            const avgStudentScore = studentScores.length ? (studentScores.reduce((sum, s) => sum + s.score, 0) / studentScores.length).toFixed(1) : 0;
            const studentAttendance = attendanceMap[student.id];
            const attendancePercentage = studentAttendance.total ? ((studentAttendance.present / studentAttendance.total) * 100).toFixed(1) : 100;

            return {
                ...student,
                attendancePercentage,
                avgScore: avgStudentScore
            };
        });

        // Apply filters
        return atRisk.filter(student => {
            const classMatch = classFilter === 'all' || student.class === classFilter;
            // For term filter, we'd need to store term with student data
            return classMatch;
        });
    };

    const getUniqueClasses = () => {
        return [...new Set(MOCK_STUDENTS.map(student => student.class))];
    };

    const getUniqueTerms = () => {
        return [...new Set(MOCK_ASSESSMENTS.map(assessment => assessment.term))];
    };

    const AddStudentForm = ({ onAdd, onCancel }) => {
        const [formData, setFormData] = useState({
            name: '',
            class: '',
            email: '',
            gender: 'male',
        });

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onAdd(formData);
        };

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="student-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="student-name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="student-class" className="block text-sm font-medium text-gray-700">Class</label>
                            <input type="text" id="student-class" name="class" value={formData.class} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="student-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="student-email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="student-gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select id="student-gender" name="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Cancel
                            </button>
                            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderAuthView = () => (
        <div id="auth-view" className="p-8 space-y-6 md:p-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to the School Portal</h1>
            <div className="flex justify-center mb-6">
                <button onClick={() => setView('login')} className={`px-6 py-2 rounded-l-full font-medium transition-colors ${view === 'login' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>Login</button>
                <button onClick={() => setView('signup')} className={`px-6 py-2 rounded-r-full font-medium transition-colors ${view === 'signup' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>Signup</button>
            </div>
            {view === 'login' ? (
                <form id="login-form" onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input type="email" id="login-email" name="email" required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="login-password" name="password" required autoComplete="current-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Login
                        </button>
                    </div>
                </form>
            ) : (
                <form id="signup-form" onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input type="email" id="signup-email" name="email" required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="signup-password" name="password" required autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirm-password" required autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phone-number" name="phone-number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="(123) 456-7890" />
                    </div>
                    <div>
                        <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">I am a...</label>
                        <select id="user-role" name="role" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Signup
                        </button>
                    </div>
                </form>
            )}
            <div className="mt-6 border-t pt-4 border-gray-200">
                <p className="text-center text-sm font-medium text-gray-500 mb-4">Or log in with a demo account:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <button onClick={() => handleDemoLogin('admin')} className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors">Admin</button>
                    <button onClick={() => handleDemoLogin('teacher')} className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">Teacher</button>
                    <button onClick={() => handleDemoLogin('student')} className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-teal-500 text-white hover:bg-teal-600 transition-colors">Student</button>
                </div>
            </div>
        </div>
    );

    const renderSidebar = () => (
        <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-[#1e2a44] text-white flex flex-col h-full rounded-r-none lg:rounded-l-xl`}>
            <div className="p-6 flex items-center justify-between border-b border-[#2d3a56]">
                <span className="text-2xl font-bold">NISSMART</span>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-full hover:bg-[#2d3a56]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                {[
                    { name: 'Dashboard', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="9" rx="2" ry="2" />
                            <rect x="14" y="3" width="7" height="5" rx="2" ry="2" />
                            <rect x="14" y="12" width="7" height="9" rx="2" ry="2" />
                            <rect x="3" y="16" width="7" height="5" rx="2" ry="2" />
                        </svg>
                    ) },
                    { name: 'Teachers', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    ) },
                    { name: 'Students', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    ) },
                    { name: 'Finance', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="22" y2="10" />
                            <line x1="10" y1="1" x2="10" y2="23" />
                        </svg>
                    ) },
                    { name: 'Calendar', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    ) },
                    { name: 'Time Table', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    ) },
                    { name: 'Message', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    ) },
                    { name: 'Settings', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82l-.06-.11a2 2 0 0 1 1-1.74l1.3-1.22c.15-.14.23-.34.23-.55l-.52-2.13a2 2 0 0 1-1.74-1l-.11-.06a1.65 1.65 0 0 0-1.82-.33L15 4.5a2 2 0 0 1-1.74-1l-2.13-.52a.5.5 0 0 0-.55.23L9.6 4.5a2 2 0 0 1-1.74 1l-.06.11a1.65 1.65 0 0 0-.33 1.82L4.5 9a2 2 0 0 1-1.74 1l-.52 2.13a.5.5 0 0 0 .23.55l1.3 1.22a2 2 0 0 1 1 1.74l-.06.11a1.65 1.65 0 0 0 .33 1.82L9 19.5a2 2 0 0 1 1.74 1l2.13.52a.5.5 0 0 0 .55-.23l1.22-1.3a2 2 0 0 1 1.74-1z" />
                        </svg>
                    ) },
                ].map(item => (
                    <button
                        key={item.name}
                        onClick={() => { setActivePage(item.name); setIsSidebarOpen(false); }}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 ${activePage === item.name ? 'bg-[#2d3a56] text-white shadow-lg' : 'text-gray-400 hover:bg-[#2d3a56] hover:text-white'}`}
                    >
                        {item.icon}
                        <span className="ml-3 font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-[#2d3a56]">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 text-gray-400 hover:bg-[#2d3a56] hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="ml-3 font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );

    const renderHeader = () => (
        <header className="flex items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-200 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div className="relative flex items-center w-full sm:w-80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </button>
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="hidden sm:block text-sm font-medium text-gray-700">Hi Admin!</div>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
    </div>
        </header>
    );

    // New Students Page component for Admin
    const renderStudentsPage = () => {
        return (
            <div className="p-4 sm:p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Students</h2>
                    <button onClick={() => setShowAddStudentForm(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Student</span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_STUDENTS.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.class}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showAddStudentForm && <AddStudentForm onAdd={handleAddStudent} onCancel={() => setShowAddStudentForm(false)} />}
            </div>
        );
    };

    const renderAdminDashboard = () => {
        const kpis = calculateKPIs();
        const atRiskStudents = getAtRiskStudents();
        const classes = getUniqueClasses();
        const terms = getUniqueTerms();

        return (
            <div className="p-4 sm:p-6 overflow-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                
                {/* CSV Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <CSVUpload type="Students" onUpload={handleCSVUpload} />
                    <CSVUpload type="Attendance" onUpload={handleCSVUpload} />
                    <CSVUpload type="Assessments" onUpload={handleCSVUpload} />
                </div>

                {/* Filters */}
                <Filters
                    classes={classes} 
                    terms={terms} 
                    onFilterChange={handleFilterChange} 
                />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <KPICard
                        title="Attendance %" 
                        value={`${kpis.attendancePercentage}%`} 
                        description="Overall attendance percentage"
                        color="blue"
                    />
                    <KPICard 
                        title="Average Score" 
                        value={`${kpis.avgScore}%`} 
                        description="Latest term average score"
                        color="green"
                    />
                    <KPICard 
                        title="At-Risk Students" 
                        value={kpis.atRiskCount} 
                        description="Students needing attention"
                        color="red"
                    />
                </div>

    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <AttendanceTrendChart timeframe="daily" />
                    <AvgScoreBySubjectChart />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <AtRiskTable 
                        students={atRiskStudents} 
                        onExport={handleExportAtRisk}
                    />
                </div>
            </div>
        );
    };

    const renderStudentDashboard = () => (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800">Student Dashboard</h3>
            <p className="text-gray-500 mt-2">View your assignments, check your grades, and access learning materials.</p>
        </div>
    );

    const renderTeacherDashboard = () => (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h3>
            <p className="text-gray-500 mt-2">Manage your classes, grade assignments, and communicate with parents and students.</p>
        </div>
    );

    const renderParentDashboard = () => (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800">Parent Dashboard</h3>
            <p className="text-gray-500 mt-2">Monitor your child's progress, view their school calendar, and contact teachers.</p>
        </div>
    );

    const renderDashboardContent = () => {
        if (role === 'admin') {
            switch (activePage) {
                case 'Dashboard':
                    return renderAdminDashboard();
                case 'Students':
                    return renderStudentsPage();
                // Other admin pages would go here
                default:
                    return <div className="p-6"><p className="text-red-500">Page not found for Admin role.</p></div>;
            }
        } else {
            switch (role) {
                case 'student':
                    return renderStudentDashboard();
                case 'teacher':
                    return renderTeacherDashboard();
                case 'parent':
                    return renderParentDashboard();
                default:
                    return <p className="text-red-500 p-6">Your account role is undefined. Please contact support.</p>;
            }
        }
    };

    const renderDashboardView = () => (
        <div className="h-screen w-full flex bg-gray-100 lg:p-8 rounded-2xl shadow-lg relative">
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            {renderSidebar()}
            <div className="flex flex-col flex-1 bg-gray-50 rounded-r-2xl overflow-hidden">
                {renderHeader()}
                <div className="flex-1 overflow-y-auto">
                    {renderDashboardContent()}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div id="app-container" className="w-full max-w-7xl bg-white rounded-xl shadow-lg transition-all duration-300">
                {message.text && (
                    <div className={`p-3 rounded-lg text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {message.text}
                    </div>
                )}
                {user ? renderDashboardView() : (
                    <div className="p-8 space-y-6 md:p-10">
                        {renderAuthView()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;