import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import UserLayout from '../../../Components/Layouts/UserLayout';
import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    TrophyIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const QuizResult = () => {
    const { quiz, latestAttempt, bestAttempt, allAttempts, course, passed, questions_count, correct_answers } = usePage().props;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <UserLayout>
            <Head title={`Kết quả - ${quiz.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-4 py-4">
                            <button
                                onClick={() => router.get(`/student/course/${course.id}/learn`)}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Kết quả: {quiz.title}</h1>
                                <p className="text-sm text-gray-600">{course.title}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Main Result Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="text-center">
                            {/* Status Icon & Text */}
                            <div className="mb-6">
                                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {passed ? (
                                        <CheckCircleIcon className="h-10 w-10 text-green-600" />
                                    ) : (
                                        <XCircleIcon className="h-10 w-10 text-red-600" />
                                    )}
                                </div>
                                <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {passed ? 'Chúc mừng! Bạn đã đạt!' : 'Chưa đạt yêu cầu'}
                                </h2>
                                <p className="text-gray-600">
                                    {passed
                                        ? 'Bạn đã hoàn thành xuất sắc bài quiz này!'
                                        : `Bạn cần đạt tối thiểu ${quiz.pass_score}% để vượt qua quiz này.`
                                    }
                                </p>
                            </div>

                            {/* Score Display */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className={`text-2xl font-bold mb-1 ${getScoreColor(latestAttempt.score_percent)}`}>
                                        {latestAttempt.score_percent}%
                                    </div>
                                    <div className="text-sm text-gray-600">Điểm của bạn</div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        {correct_answers}/{questions_count}
                                    </div>
                                    <div className="text-sm text-gray-600">Câu đúng</div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">
                                        {quiz.pass_score}%
                                    </div>
                                    <div className="text-sm text-gray-600">Điểm đậu</div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        {bestAttempt ? bestAttempt.score_percent : latestAttempt.score_percent}%
                                    </div>
                                    <div className="text-sm text-gray-600">Cao nhất</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Kết quả</span>
                                    <span>{latestAttempt.score_percent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(latestAttempt.score_percent, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span className="text-orange-500">
                                        {quiz.pass_score}% (Đậu)
                                    </span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                            <div>
                                <div className="text-gray-600">Thời gian</div>
                                <div className="font-medium">{quiz.duration_minutes} phút</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Hoàn thành</div>
                                <div className="font-medium">
                                    {new Date(latestAttempt.attempted_at).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Kết quả</div>
                                <div className={`font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {passed ? 'Đạt' : 'Không đạt'}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Lần làm</div>
                                <div className="font-medium">{allAttempts?.length || 1}</div>
                            </div>
                        </div>
                    </div>

                    {/* Attempts History - Simplified */}
                    {allAttempts && allAttempts.length > 1 && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Lịch sử ({allAttempts.length} lần)
                            </h3>
                            <div className="space-y-2">
                                {allAttempts.slice(0, 5).map((attempt, index) => (
                                    <div
                                        key={attempt.id}
                                        className={`flex items-center justify-between p-3 rounded ${index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium">
                                                Lần {allAttempts.length - index}
                                            </span>
                                            {index === 0 && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    Mới nhất
                                                </span>
                                            )}
                                            {attempt.id === bestAttempt?.id && attempt.id !== latestAttempt.id && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                    Cao nhất
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className={`font-medium ${getScoreColor(attempt.score_percent)}`}>
                                                {attempt.score_percent}%
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs ${attempt.score_percent >= quiz.pass_score
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {attempt.score_percent >= quiz.pass_score ? 'Đạt' : 'Không đạt'}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(attempt.attempted_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {allAttempts.length > 5 && (
                                    <div className="text-center text-sm text-gray-500 py-2">
                                        ... và {allAttempts.length - 5} lần khác
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {passed && (
                        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 mb-6 text-white text-center">
                            <TrophyIcon className="mx-auto h-8 w-8 mb-2" />
                            <h3 className="font-bold mb-1">Hoàn thành xuất sắc!</h3>
                            <p className="text-sm">Bạn đã vượt qua quiz thành công. Tiếp tục phát huy!</p>
                        </div>
                    )}

                    {/* Encouragement Message */}
                    {!passed && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                            <h3 className="font-semibold text-blue-800 mb-2">Đừng nản lòng!</h3>
                            <p className="text-blue-700 text-sm mb-3">
                                Bạn có thể làm lại quiz này để cải thiện điểm số. Hãy xem lại bài học và thử lại!
                            </p>
                            <div className="text-xs text-blue-600">
                                💡 <strong>Gợi ý:</strong> Xem lại các video bài học và tài liệu trước khi thử lại.
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => router.get(`/student/course/${course.id}/learn`)}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Quay lại khóa học
                            </button>

                            <button
                                onClick={() => router.get(`/student/quiz/${quiz.id}`)}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                Làm lại quiz
                            </button>

                            {!passed && (
                                <button
                                    onClick={() => router.get(`/student/course/${course.id}/learn`)}
                                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Xem lại bài học
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            <ClockIcon className="inline h-4 w-4 mr-1" />
                            Kết quả đã được lưu vào hệ thống
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default QuizResult;
