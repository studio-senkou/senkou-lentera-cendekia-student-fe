import { useState } from 'react'
import { Skeleton } from './ui/skeleton'

export const ImageWithSkeleton = ({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && !imageError && (
        <Skeleton className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
      )}
      {!imageError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto rounded-lg transition-opacity duration-300 ${
            !imageLoaded ? 'opacity-0 absolute inset-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
        />
      )}
      {imageError && (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
          <span className="text-gray-500 text-sm">Gagal memuat gambar</span>
        </div>
      )}
    </div>
  )
}
