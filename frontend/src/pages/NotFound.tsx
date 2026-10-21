import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Home as HomeIcon, AlertOctagon } from 'lucide-react'
import Button from '../components/ui/Button'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <AlertOctagon className="w-10 h-10 stroke-[1.75]" />
      </div>

      <span className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-1">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-8 leading-relaxed">
        The deal or page you are looking for doesn't exist, was renamed, or has moved to another URL.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" leftIcon={<HomeIcon className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
            Search Products
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
