import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ url, title }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(error) {
        setError('Không thể tải file PDF');
        setLoading(false);
        console.error('PDF load error:', error);
    }

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Tải xuống để xem
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                {numPages && (
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPrevPage}
                                disabled={pageNumber <= 1}
                                className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                ← Trước
                            </button>
                            <span className="text-sm text-gray-600">
                                Trang {pageNumber} / {numPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={pageNumber >= numPages}
                                className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Sau →
                            </button>
                        </div>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Tải xuống
                        </a>
                    </div>
                )}
            </div>

            <div className="p-4">
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                )}

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading=""
                    className="flex justify-center"
                >
                    <Page
                        pageNumber={pageNumber}
                        width={Math.min(800, window.innerWidth - 100)}
                        className="shadow-lg"
                    />
                </Document>
            </div>
        </div>
    );
};

export default PDFViewer;