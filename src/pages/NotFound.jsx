import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-soft px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <MessageCircleOff className="w-8 h-8 text-primary-500" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/chat"
        className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors"
      >
        Back to ChatFlow
      </Link>
    </div>
  );
}
