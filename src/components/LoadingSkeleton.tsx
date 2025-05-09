// components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header skeleton */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Hero section skeleton */}
        <div className="hero-gradient py-20">
          <div className="container mx-auto px-4">
            <div className="md:w-1/2 mb-10">
              <div className="h-12 w-3/4 bg-white bg-opacity-20 rounded mb-4 animate-pulse"></div>
              <div className="h-24 bg-white bg-opacity-20 rounded mb-8 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="h-12 w-40 bg-white rounded-lg animate-pulse"></div>
                <div className="h-12 w-40 border-2 border-white rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section skeleton */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }