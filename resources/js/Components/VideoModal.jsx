import React, { useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const VideoModal = ({ isOpen, onClose, video }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.keyCode === 27) {
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
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    const getVideoSource = () => {
        if (!video) return null;

        // Lấy URL video từ file_url hoặc file
        let videoUrl = video.file_url || video.file;
        const fileType = video.file_type?.toLowerCase();

        if (!videoUrl) return null;

        // Xử lý theo file_type trước
        if (fileType === 'youtube') {
            const videoId = extractYouTubeId(videoUrl);
            if (videoId) {
                return {
                    type: 'video',
                    sources: [{
                        src: videoId,
                        provider: 'youtube'
                    }]
                };
            }
        }

        if (fileType === 'vimeo') {
            const videoId = extractVimeoId(videoUrl);
            if (videoId) {
                return {
                    type: 'video',
                    sources: [{
                        src: videoId,
                        provider: 'vimeo'
                    }]
                };
            }
        }

        // Xử lý URL có chứa youtube/vimeo
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = extractYouTubeId(videoUrl);
            if (videoId) {
                return {
                    type: 'video',
                    sources: [{
                        src: videoId,
                        provider: 'youtube'
                    }]
                };
            }
        }

        if (videoUrl.includes('vimeo.com')) {
            const videoId = extractVimeoId(videoUrl);
            if (videoId) {
                return {
                    type: 'video',
                    sources: [{
                        src: videoId,
                        provider: 'vimeo'
                    }]
                };
            }
        }

        // Xử lý các URL khác
        if (videoUrl.startsWith('http')) {
            return {
                type: 'video',
                sources: [
                    {
                        src: videoUrl,
                        provider: 'html5',
                    }
                ]
            };
        }

        // Nếu là file video upload, sử dụng streaming URL
        let streamingUrl;
        if (videoUrl.startsWith('storage/videos/')) {
            const fileName = videoUrl.replace('storage/videos/', '');
            streamingUrl = `/video/${fileName}`;
        } else if (videoUrl.startsWith('storage/')) {
            streamingUrl = `${window.location.origin}/${videoUrl}`;
        } else if (!videoUrl.startsWith('/')) {
            streamingUrl = `/video/${videoUrl}`;
        } else {
            streamingUrl = videoUrl;
        }

        return {
            type: 'video',
            sources: [
                {
                    src: streamingUrl,
                    type: getVideoType(videoUrl),
                }
            ]
        };
    };

    const getVideoProvider = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('vimeo.com')) {
            return 'vimeo';
        }
        return 'html5';
    };

    const getVideoType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'ogg':
                return 'video/ogg';
            default:
                return 'video/mp4';
        }
    };

    const plyrOptions = {
        controls: [
            'play-large',
            'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed'],
        speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
        },
        keyboard: {
            focused: true,
            global: false
        },
        tooltips: {
            controls: true,
            seek: true
        },
        captions: {
            active: false,
            language: 'vi'
        },
        // Tối ưu cho streaming
        preload: 'metadata',
        autopause: true,
        hideControls: false
    };

    if (!isOpen) return null;

    const videoSource = getVideoSource();

    return (
        <div
            className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        {video?.title || 'Video Preview'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Video Content */}
                <div className="p-4">
                    {videoSource ? (
                        <div className="w-full relative">
                            <Plyr
                                source={videoSource}
                                options={plyrOptions}
                            />
                            {/* Logo Watermark */}
                            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                                <img
                                    src="/assets/images/avatar/kedu.png"
                                    alt="K-EDU"
                                    className="w-36 h-36 opacity-80"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Không thể tải video</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Debug: {JSON.stringify(video, null, 2)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4">
                    <div className="flex justify-end space-x-2">
                        {/* Debug info */}
                        <span className="text-xs text-gray-500">
                            URL: {videoSource?.sources?.[0]?.src || 'N/A'}
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions
const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const extractVimeoId = (url) => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

export default VideoModal;