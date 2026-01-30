import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * 404 Not Found page
 * Displayed when a route doesn't match any defined routes
 * Supports dark mode
 */
function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white dark:bg-gray-900">
      <div className="max-w-md">
        {/* 404 illustration */}
        <div className="mb-8">
          <div className="relative">
            <span className="text-9xl font-bold text-gray-200 dark:text-gray-700">
              404
            </span>
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-24 h-24 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Sayfa Bulunamadı
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir.
          Ana sayfaya dönerek devam edebilirsiniz.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGoHome} size="lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Ana Sayfaya Git
          </Button>
          <Button onClick={handleGoBack} variant="secondary" size="lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
