import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const ExternalVideoModal = ({ isOpen, onClose, video, courseId, onVideoComplete }) => {
    console.log('ExternalVideoModal rendered with video:', video);
    const modalRef = useRef(null);
    const plyrRef = useRef(null);

    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isOpen && video) {
            setIsCompleted(false);
        }
    }, [isOpen, video]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (event) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    const markVideoComplete = async () => {
        try {
            console.log('Marking video as complete:', '/student/course/' + courseId + '/resource/' + video.id + '/complete');
            const response = await axios.post(`/student/course/${courseId}/resource/${video.id}/complete`);
            if (response.data.success) {
                setIsCompleted(true);
                if (onVideoComplete) {
                    onVideoComplete(video.id);
                }
            }
        } catch (error) {
            console.error('Error marking video as complete:', error);
        }
    };

    const handleManualComplete = () => {
        if (isCompleted) return;
        markVideoComplete();
    };

    // Detect video provider
    const getVideoProvider = (url) => {
        if (!url) return 'unknown';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('vimeo.com')) {
            return 'vimeo';
        }
        return 'unknown';
    };

    // Extract YouTube video ID
    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Extract Vimeo video ID
    const extractVimeoId = (url) => {
        const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const getVideoSource = () => {
        if (!video?.file_url) return null;

        const provider = getVideoProvider(video.file_url);

        if (provider === 'youtube') {
            const videoId = extractYouTubeId(video.file_url);
            console.log('YouTube video ID:', videoId);
            return {
                type: 'video',
                sources: [
                    {
                        src: videoId,
                        provider: 'youtube'
                    }
                ]
            };
        } else if (provider === 'vimeo') {
            const videoId = extractVimeoId(video.file_url);
            return {
                type: 'video',
                sources: [
                    {
                        src: videoId,
                        provider: 'vimeo'
                    }
                ]
            };
        }

        return null;
    };

    // Simple Plyr options
    const plyrOptions = {
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'fullscreen'
        ],
        settings: ['quality', 'speed'],
        speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 2]
        },
        keyboard: {
            focused: true,
            global: false
        },
        tooltips: {
            controls: true,
            seek: true
        },
        // YouTube/Vimeo specific
        youtube: {
            noCookie: false,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1
        },
        vimeo: {
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: false
        },
        autopause: true,
        hideControls: false,
        ratio: '16:9'
    };

    if (!isOpen || !video) return null;

    const videoSource = getVideoSource();
    const provider = getVideoProvider(video.file_url);

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col mx-4 my-4">

                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${provider === 'youtube' ? 'bg-red-600' : 'bg-blue-600'
                            }`}>
                            {provider.toUpperCase()}
                        </div>
                        <h3 className="text-lg font-semibold truncate max-w-md">{video.title}</h3>
                        {isCompleted && (
                            <div className="flex items-center space-x-1 text-green-400">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span className="text-sm">Đã hoàn thành</span>
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex items-center space-x-3">
                        {/* Status */}
                        <div className="text-right">
                            {isCompleted ? (
                                <div className="text-green-400">
                                    <div className="text-sm font-medium">✅ Hoàn thành!</div>
                                    <div className="text-xs">Đã đánh dấu</div>
                                </div>
                            ) : (
                                <div className="text-gray-300">
                                    <div className="text-sm">Chưa hoàn thành</div>
                                    <div className="text-xs text-gray-400">Nhấn nút bên phải</div>
                                </div>
                            )}
                        </div>
                        {/* Manual completion button */}
                        {!isCompleted && (
                            <button
                                onClick={handleManualComplete}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm flex items-center"
                                title="Đánh dấu bài học đã hoàn thành"
                            >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Hoàn thành bài học
                            </button>
                        )}

                        {isCompleted && (
                            <div className="flex items-center space-x-2 text-green-400 px-4 py-2 bg-green-600/20 rounded-lg">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Đã hoàn thành!</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Video Container - Optimized for laptop screen */}
                <div className="relative w-full bg-black aspect-video">
                    {videoSource ? (
                        <div className="relative w-full h-full">
                            <div className="w-full h-full">
                                <Plyr
                                    ref={plyrRef}
                                    source={videoSource}
                                    options={{
                                        ...plyrOptions,
                                        // Laptop-optimized ratio
                                        ratio: '16:9',
                                        // Ensure proper scaling
                                        fullscreen: {
                                            enabled: true,
                                            fallback: true,
                                            iosNative: false,
                                            container: null
                                        }
                                    }}
                                />
                            </div>

                            {/* Watermark overlay */}
                            <div className="absolute top-3 right-3 z-10 pointer-events-none opacity-30">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
                                    <span className="text-white font-bold text-sm">K-EDU</span>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-white">
                                <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-3 text-red-400" />
                                <p className="text-base mb-2">Không thể phát video này</p>
                                <p className="text-sm text-gray-400">URL không hợp lệ hoặc không được hỗ trợ</p>
                                <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto break-all">
                                    URL: {video.file_url}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Compact for laptop with completion button */}
                <div className="p-3 bg-gray-800 text-white rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {video.note && (
                                <p className="text-sm text-gray-300 mb-1 truncate">
                                    📝 {video.note}
                                </p>
                            )}
                            <div className="text-xs text-gray-400">
                                Platform: {provider.toUpperCase()}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalVideoModal;