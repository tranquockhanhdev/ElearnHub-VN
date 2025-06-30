import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import UserLayout from '../../../Components/Layouts/UserLayout';
import {
    ClockIcon,
    QuestionMarkCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

const QuizShow = () => {
    const { quiz, questions, course, attemptCount, bestAttempt, timeLimit } = usePage().props;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // Timer
    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Only handle Enter key and avoid triggering when modal is open
            if (event.key === 'Enter' && !showConfirmSubmit) {
                event.preventDefault();

                if (currentQuestion < questions.length - 1) {
                    // Move to next question
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    // Last question - show submit confirmation
                    setShowConfirmSubmit(true);
                }
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyPress);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentQuestion, questions.length, showConfirmSubmit]);

    // Format time
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handle answer change
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Navigate to question
    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    // Submit quiz
    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const timeTaken = timeLimit - timeRemaining;

            const response = await axios.post(`/student/quiz/${quiz.id}/submit`, {
                answers,
                time_taken: timeTaken
            });

            if (response.data.success) {
                router.get(`/student/quiz/${quiz.id}/result`);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
            setIsSubmitting(false);
        }
    };

    // Check if all questions answered
    const allQuestionsAnswered = questions.length === Object.keys(answers).length;

    return (
        <UserLayout>
            <Head title={`${quiz.title} - ${course.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => router.get(`/student/course/${course.id}/learn`)}
                                    className="text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <ArrowLeftIcon className="h-6 w-6" />
                                </button>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-lg font-bold text-gray-900 truncate">{quiz.title}</h1>
                                    <p className="text-sm text-gray-600 truncate">{course.title}</p>
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 flex-shrink-0">
                                <ClockIcon className="h-4 w-4 text-orange-600" />
                                <span className={`font-mono text-sm font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-orange-600'
                                    }`}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
                        {/* Main Content - Left Side */}
                        <div className="flex-1 flex flex-col order-2 lg:order-1">
                            {/* Progress Bar */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Câu {currentQuestion + 1} / {questions.length}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Đã trả lời: {Object.keys(answers).length}/{questions.length}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${((currentQuestion + 1) / questions.length) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Quiz Content */}
                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 flex-1 flex flex-col">
                                {questions.length > 0 && (
                                    <>
                                        {/* Question */}
                                        <div className="mb-4 md:mb-6">
                                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed">
                                                {questions[currentQuestion]?.question_text}
                                            </h2>
                                        </div>

                                        {/* Answer Options - Responsive Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                            {['A', 'B', 'C', 'D'].map((option) => {
                                                const optionKey = `option_${option.toLowerCase()}`;
                                                const optionText = questions[currentQuestion]?.[optionKey];

                                                if (!optionText) return null;

                                                const isSelected = answers[questions[currentQuestion]?.id] === option;

                                                return (
                                                    <label
                                                        key={option}
                                                        className={`flex items-start space-x-3 p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 min-h-[60px] ${isSelected
                                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${isSelected
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {isSelected && (
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start">
                                                                <span className="font-semibold text-gray-700 mr-2 flex-shrink-0">
                                                                    {option}.
                                                                </span>
                                                                <span className="text-gray-900 leading-relaxed break-words text-sm md:text-base">
                                                                    {optionText}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name={`question_${questions[currentQuestion]?.id}`}
                                                            value={option}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(questions[currentQuestion]?.id, e.target.value)}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Navigation Buttons - Always at bottom */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                        disabled={currentQuestion === 0}
                                        className="px-4 md:px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded hover:bg-gray-50 text-sm md:text-base"
                                    >
                                        ← Câu trước
                                    </button>

                                    {/* Enter key hint */}
                                    <div className="hidden sm:flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd>
                                        <span className="ml-1">để tiếp tục</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        {currentQuestion < questions.length - 1 ? (
                                            <button
                                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                                className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm md:text-base focus:ring-2 focus:ring-blue-300"
                                            >
                                                Câu tiếp →
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setShowConfirmSubmit(true)}
                                                className="px-4 md:px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium text-sm md:text-base focus:ring-2 focus:ring-green-300"
                                            >
                                                Nộp bài
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Question Navigation */}
                        <div className="w-full lg:w-80 flex flex-col order-1 lg:order-2">
                            {/* Question Numbers Grid - 5 per row */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh sách câu hỏi</h3>
                                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2">
                                    {questions.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToQuestion(index)}
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded text-xs md:text-sm font-medium transition-colors ${currentQuestion === index
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : answers[questions[index]?.id]
                                                    ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                                }`}
                                            title={`Câu ${index + 1}${answers[questions[index]?.id] ? ' (Đã trả lời)' : ''}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats - Hidden on mobile to save space */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 hidden md:block">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thống kê</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng số câu:</span>
                                        <span className="font-medium">{questions.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Đã trả lời:</span>
                                        <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Chưa trả lời:</span>
                                        <span className="font-medium text-orange-600">{questions.length - Object.keys(answers).length}</span>
                                    </div>
                                    {attemptCount > 0 && (
                                        <div className="flex justify-between pt-2 border-t">
                                            <span className="text-gray-600">Lần làm:</span>
                                            <span className="font-medium">{attemptCount + 1}</span>
                                        </div>
                                    )}
                                    {bestAttempt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Điểm cao nhất:</span>
                                            <span className="font-medium text-blue-600">{bestAttempt.score_percent}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Legend - Hidden on mobile to save space */}
                            <div className="bg-white rounded-lg shadow-sm p-4 hidden md:block">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Chú thích</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                        <span className="text-gray-600">Câu hiện tại</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                        <span className="text-gray-600">Đã trả lời</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                                        <span className="text-gray-600">Chưa trả lời</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Nộp bài quiz?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn đã trả lời <span className="font-semibold">{Object.keys(answers).length}/{questions.length}</span> câu hỏi.
                                {!allQuestionsAnswered && (
                                    <span className="text-red-600 block mt-1 font-medium">
                                        Còn {questions.length - Object.keys(answers).length} câu chưa trả lời.
                                    </span>
                                )}
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Tiếp tục làm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmSubmit(false);
                                        handleSubmit();
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default QuizShow;
