import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    XMarkIcon,
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    CheckCircleIcon,
    ClockIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
const StudentVideoModal = ({ isOpen, onClose, video, courseId, onVideoComplete }) => {
    const modalRef = useRef(null);
    const videoRef = useRef(null);
    const seekWarningTimeoutRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [watchedPercentage, setWatchedPercentage] = useState(0);
    const [hasWatchedThreshold, setHasWatchedThreshold] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Thêm state cho seek tracking
    const [lastSeekTime, setLastSeekTime] = useState(0);
    const [seekCount, setSeekCount] = useState(0);
    const [showSeekWarning, setShowSeekWarning] = useState(false);
    const [watchedSegments, setWatchedSegments] = useState([]); // Tracking các segment đã xem
    const [maxWatchedTime, setMaxWatchedTime] = useState(0); // Thời gian xa nhất đã xem

    // Threshold để đánh dấu video đã xem (85%)
    const COMPLETION_THRESHOLD = 0.8;

    // Cài đặt cho seek tracking
    const SEEK_THRESHOLD = 60; // Nếu tua quá 30 giây thì cảnh báo
    const MAX_SEEKS_PER_MINUTE = 5; // Tối đa 5 lần tua trong 1 phút
    const SEEK_RESET_INTERVAL = 60000; // Reset đếm seek sau 60 giây

    useEffect(() => {
        if (isOpen && video) {
            setCurrentTime(0);
            setIsPlaying(false);
            setIsCompleted(false);
            setWatchedPercentage(0);
            setHasWatchedThreshold(false);
            setShowSettings(false);
            setLastSeekTime(0);
            setSeekCount(0);
            setShowSeekWarning(false);
            setWatchedSegments([]);
            setMaxWatchedTime(0);
        }
    }, [isOpen, video]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Reset seek count sau một khoảng thời gian
    useEffect(() => {
        if (seekCount > 0) {
            const timer = setTimeout(() => {
                setSeekCount(0);
            }, SEEK_RESET_INTERVAL);

            return () => clearTimeout(timer);
        }
    }, [seekCount]);

    const handleBackdropClick = (event) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    const updateWatchedSegments = (currentTime) => {
        // Cập nhật segments đã xem để tính toán chính xác progress
        setWatchedSegments(prev => {
            const newSegments = [...prev];
            const segmentSize = 5; // 5 giây mỗi segment
            const segmentIndex = Math.floor(currentTime / segmentSize);

            if (!newSegments.includes(segmentIndex)) {
                newSegments.push(segmentIndex);
            }

            return newSegments;
        });
    };

    const calculateActualWatchedPercentage = () => {
        if (duration === 0) return 0;

        const segmentSize = 5;
        const totalSegments = Math.ceil(duration / segmentSize);
        const watchedPercentage = (watchedSegments.length / totalSegments) * 100;

        return Math.min(watchedPercentage, 100);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;

            setCurrentTime(current);
            setDuration(total);

            // Cập nhật thời gian xa nhất đã xem (chỉ khi phát bình thường, không tua)
            if (current > maxWatchedTime && isPlaying) {
                setMaxWatchedTime(current);
            }

            // Cập nhật segments đã xem
            updateWatchedSegments(current);

            if (total > 0) {
                // Tính progress dựa trên segments thực sự đã xem
                const actualPercentage = calculateActualWatchedPercentage();
                setWatchedPercentage(actualPercentage);

                // Kiểm tra đã xem đủ threshold chưa
                if (actualPercentage >= (COMPLETION_THRESHOLD * 100) && !hasWatchedThreshold) {
                    setHasWatchedThreshold(true);
                    markVideoComplete();
                }
            }
        }
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        setIsCompleted(true);
        if (!hasWatchedThreshold) {
            markVideoComplete();
        }
    };

    const markVideoComplete = async () => {
        try {
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

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const showSeekWarningMessage = (message) => {
        setShowSeekWarning(message);

        // Clear existing timeout
        if (seekWarningTimeoutRef.current) {
            clearTimeout(seekWarningTimeoutRef.current);
        }

        // Hide warning after 3 seconds
        seekWarningTimeoutRef.current = setTimeout(() => {
            setShowSeekWarning(false);
        }, 3000);
    };

    const handleSeek = (e) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * duration;
            const timeDifference = Math.abs(newTime - currentTime);

            // Kiểm tra tua quá nhanh
            if (timeDifference > SEEK_THRESHOLD) {
                showSeekWarningMessage(`Bạn đang tua quá nhanh (${Math.round(timeDifference)}s)! Hãy xem video một cách tuần tự để hiểu bài tốt hơn.`);
            }

            // Kiểm tra tua quá nhiều lần
            const now = Date.now();
            if (now - lastSeekTime < 2000) { // Nếu tua trong vòng 2 giây
                setSeekCount(prev => prev + 1);
                if (seekCount >= MAX_SEEKS_PER_MINUTE - 1) {
                    showSeekWarningMessage('Bạn đang tua quá nhiều lần! Điều này có thể ảnh hưởng đến việc học của bạn.');
                }
            }

            setLastSeekTime(now);

            // Không cho phép tua quá xa so với thời gian đã xem (chống gian lận)
            const maxAllowedTime = maxWatchedTime + 60; // Cho phép tua tối đa 60s trước thời gian đã xem
            const seekTime = Math.min(newTime, maxAllowedTime);

            if (newTime > maxAllowedTime) {
                showSeekWarningMessage('Bạn cần xem video tuần tự từ đầu. Không thể nhảy quá xa!');
            }

            videoRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            setIsMuted(newMuted);
            videoRef.current.muted = newMuted;
            if (newMuted) {
                videoRef.current.volume = 0;
            } else {
                videoRef.current.volume = volume;
            }
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            modalRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const changePlaybackRate = (rate) => {
        if (videoRef.current) {
            // Giới hạn tốc độ phát để tránh xem quá nhanh
            if (rate > 2) {
                showSeekWarningMessage('Tốc độ phát quá nhanh có thể ảnh hưởng đến việc học!');
                return;
            }

            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getVideoSource = () => {
        if (!video?.file_url) return '';

        // Nếu là URL đầy đủ (YouTube, Vimeo, etc.)
        if (video.file_url.startsWith('http')) {
            return video.file_url;
        }

        // Nếu là file local, sử dụng streaming endpoint
        if (video.file_url.startsWith('storage/videos/')) {
            const fileName = video.file_url.replace('storage/videos/', '');
            return `/video/${fileName}`;
        }

        // Fallback cho các đường dẫn khác
        return `/video/${video.file_url}`;
    };
    const isVideoFile = () => {
        return video?.file_type && ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(video.file_type.toLowerCase());
    };

    if (!isOpen || !video) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className={`relative w-full h-full max-w-7xl max-h-full flex flex-col ${isFullscreen ? 'max-w-none max-h-none' : 'mx-4 my-8'}`}>

                {/* Seek Warning Overlay */}
                {showSeekWarning && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 bg-red-600/90 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg max-w-md text-center">
                        <div className="flex items-center space-x-2 mb-2">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-300" />
                            <span className="font-semibold">Cảnh báo!</span>
                        </div>
                        <p className="text-sm">{showSeekWarning}</p>
                    </div>
                )}

                {/* Header */}
                {!isFullscreen && (
                    <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-t-lg">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold truncate max-w-md">{video.title}</h3>
                            {hasWatchedThreshold && (
                                <div className="flex items-center space-x-1 text-green-400">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span className="text-sm">Hoàn thành</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                <ClockIcon className="w-4 h-4" />
                                <span>{Math.round(watchedPercentage)}%</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Video Container */}
                <div className={`flex-1 relative bg-black ${!isFullscreen ? 'rounded-b-lg overflow-hidden' : ''}`}>
                    {isVideoFile() ? (
                        <video
                            ref={videoRef}
                            src={getVideoSource()}
                            className="w-full h-full object-contain"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleVideoEnd}
                            onLoadedMetadata={() => {
                                if (videoRef.current) {
                                    setDuration(videoRef.current.duration);
                                }
                            }}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            controls={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-white">
                                <p className="text-lg mb-4">Không thể phát video này</p>
                                <p className="text-sm text-gray-400">Định dạng video không được hỗ trợ</p>
                            </div>
                        </div>
                    )}

                    {/* Watermark */}
                    <div className="absolute top-4 right-4 pointer-events-none opacity-20">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                            <span className="text-white font-bold text-lg">K-EDU</span>
                        </div>
                    </div>

                    {/* Custom Controls Overlay */}
                    {isVideoFile() && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div
                                    className="w-full h-1 bg-white/30 rounded cursor-pointer group"
                                    onClick={handleSeek}
                                >
                                    <div className="relative h-full">
                                        {/* Progress */}
                                        <div
                                            className="h-full bg-blue-500 rounded transition-all duration-150"
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        />
                                        {/* Max watched indicator */}
                                        <div
                                            className="absolute top-0 w-0.5 h-full bg-yellow-400 opacity-50"
                                            style={{ left: `${(maxWatchedTime / duration) * 100}%` }}
                                        />
                                        {/* Completion threshold indicator */}
                                        <div
                                            className="absolute top-0 w-0.5 h-full bg-green-400"
                                            style={{ left: `${COMPLETION_THRESHOLD * 100}%` }}
                                        />
                                        {/* Hover indicator */}
                                        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-full bg-white/20 rounded" />
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bar legend */}
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Đã xem: {Math.round(watchedPercentage)}%</span>
                                    <span>Cần đạt: {Math.round(COMPLETION_THRESHOLD * 100)}%</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center space-x-4">
                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon className="w-6 h-6" />
                                        ) : (
                                            <PlayIcon className="w-6 h-6" />
                                        )}
                                    </button>

                                    {/* Volume */}
                                    <div className="flex items-center space-x-2 group">
                                        <button onClick={toggleMute} className="p-1">
                                            {isMuted ? (
                                                <SpeakerXMarkIcon className="w-5 h-5" />
                                            ) : (
                                                <SpeakerWaveIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-20 accent-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <span className="text-sm font-mono">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Progress indicator */}
                                    <div className="flex items-center space-x-2">
                                        {hasWatchedThreshold ? (
                                            <div className="flex items-center space-x-1 text-green-400 text-sm">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                <span>Hoàn thành</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm bg-black/50 px-2 py-1 rounded">
                                                {Math.round(watchedPercentage)}% / {Math.round(COMPLETION_THRESHOLD * 100)}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Seek count warning */}
                                    {seekCount > 2 && (
                                        <div className="text-xs bg-orange-600/80 px-2 py-1 rounded">
                                            Tua: {seekCount}/{MAX_SEEKS_PER_MINUTE}
                                        </div>
                                    )}

                                    {/* Settings */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSettings(!showSettings)}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <Cog6ToothIcon className="w-5 h-5" />
                                        </button>

                                        {showSettings && (
                                            <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[120px]">
                                                <div className="text-sm text-gray-300 mb-2">Tốc độ phát</div>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                                                    <button
                                                        key={rate}
                                                        onClick={() => changePlaybackRate(rate)}
                                                        className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white/20 ${playbackRate === rate ? 'text-blue-400' : 'text-white'
                                                            }`}
                                                    >
                                                        {rate}x {rate === 1 ? '(Bình thường)' : rate > 1.5 ? '⚠️' : ''}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Fullscreen */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        {isFullscreen ? (
                                            <ArrowsPointingInIcon className="w-5 h-5" />
                                        ) : (
                                            <ArrowsPointingOutIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Video Info */}
                {!isFullscreen && (
                    <div className="p-4 bg-gray-800 text-white rounded-b-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {video.note && (
                                    <p className="text-sm text-gray-300 mb-2">
                                        {video.note}
                                    </p>
                                )}
                                <div className="text-xs text-gray-400">
                                    Định dạng: {video.file_type?.toUpperCase()} • Dung lượng: {video.file_size || 'N/A'}
                                </div>
                                {seekCount > 0 && (
                                    <div className="text-xs text-orange-400 mt-1">
                                        ⚠️ Đã tua {seekCount} lần trong phút qua
                                    </div>
                                )}
                            </div>
                            <div className="ml-4">
                                {hasWatchedThreshold ? (
                                    <div className="flex items-center space-x-2 text-green-400">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        <span className="text-sm font-medium">Video đã hoàn thành!</span>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-300 text-right">
                                        <div>Cần xem thêm {Math.max(0, Math.round((COMPLETION_THRESHOLD * 100) - watchedPercentage))}%</div>
                                        <div className="text-xs text-gray-400">để hoàn thành bài học</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentVideoModal;