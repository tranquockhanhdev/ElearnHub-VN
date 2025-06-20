import { useState } from "react";

export const useImage = (initialImage = null) => {
    const [imagePreview, setImagePreview] = useState(initialImage);
    const [imageError, setImageError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // File size formatter
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Validate image file
    const validateImage = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return "Chỉ hỗ trợ file JPG, PNG, GIF";
        }

        if (file.size > maxSize) {
            return "Kích thước file không được vượt quá 5MB";
        }

        return null;
    };

    // Check image dimensions
    const checkImageDimensions = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                const aspectRatio = this.width / this.height;
                const isGoodRatio = Math.abs(aspectRatio - 4 / 3) <= 0.1;

                resolve({
                    width: this.width,
                    height: this.height,
                    aspectRatio: aspectRatio,
                    isRecommendedRatio: isGoodRatio,
                    warning: !isGoodRatio
                        ? "Tỷ lệ ảnh nên là 4:3 để hiển thị tốt nhất"
                        : null,
                });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    // Handle image upload
    const handleImageUpload = async (e, onFileSelect) => {
        const file = e.target.files[0];
        setImageError("");

        if (!file) return;

        // Validate file
        const validationError = validateImage(file);
        if (validationError) {
            setImageError(validationError);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Check dimensions
            const dimensions = await checkImageDimensions(file);

            if (dimensions.warning) {
                setImageError(dimensions.warning);
                // Still allow upload but show warning
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        setIsUploading(false);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Call callback with file and dimensions
            if (onFileSelect) {
                onFileSelect(file, dimensions);
            }

            console.log("✅ Image uploaded:", {
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                dimensions: `${dimensions.width}x${dimensions.height}`,
                aspectRatio: dimensions.aspectRatio.toFixed(2),
            });
        } catch (error) {
            setImageError("Có lỗi xảy ra khi tải ảnh");
            setIsUploading(false);
            console.error("❌ Image upload error:", error);
        }
    };

    // Handle drag & drop
    const handleDrop = async (e, onFileSelect) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            // Create synthetic event
            const syntheticEvent = {
                target: { files: [file] },
            };

            await handleImageUpload(syntheticEvent, onFileSelect);
        }
    };

    // Remove image
    const removeImage = (fileInputId) => {
        setImagePreview(null);
        setImageError("");
        setUploadProgress(0);

        // Reset file input
        if (fileInputId) {
            const fileInput = document.getElementById(fileInputId);
            if (fileInput) {
                fileInput.value = "";
            }
        }

        console.log("🗑️ Image removed");
    };

    // Reset all states
    const resetImage = () => {
        setImagePreview(null);
        setImageError("");
        setIsUploading(false);
        setUploadProgress(0);
    };

    return {
        // States
        imagePreview,
        imageError,
        isUploading,
        uploadProgress,

        // Actions
        handleImageUpload,
        handleDrop,
        removeImage,
        resetImage,

        // Utilities
        formatFileSize,
        validateImage,
        checkImageDimensions,
    };
};
