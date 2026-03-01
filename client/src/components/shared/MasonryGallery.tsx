import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MasonryGalleryProps {
  photos: string[];
}

export function MasonryGallery({ photos }: MasonryGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex !== null) {
        setCurrentPhotoIndex((prev) => (prev! + 1) % photos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex !== null) {
        setCurrentPhotoIndex((prev) => (prev! - 1 + photos.length) % photos.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-2 h-auto md:h-[500px]">
        
        {/* --- Main image --- */}
        <div className="h-[300px] md:h-full md:col-span-2 md:row-span-2 relative">
          <button
            onClick={() => setCurrentPhotoIndex(0)} 
            className="w-full h-full overflow-hidden rounded-lg group block"
          >
            <img
              src={photos[0]}
              alt="Hotel main view"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        </div>

        {/* --- Top right images --- */}
        <div className="hidden md:grid md:col-span-2 md:row-span-1 md:grid-cols-2 gap-2 h-full">
          {photos[1] && (
            <button
              onClick={() => setCurrentPhotoIndex(1)} 
              className="w-full h-full overflow-hidden rounded-lg group"
            >
              <img src={photos[1]} alt="View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </button>
          )}
          {photos[2] && (
            <button
              onClick={() => setCurrentPhotoIndex(2)} 
              className="w-full h-full overflow-hidden rounded-lg group"
            >
              <img src={photos[2]} alt="View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </button>
          )}
        </div>

        {/* --- Bottom right images --- */}
        <div className="hidden md:grid md:col-span-2 md:row-span-1 md:grid-cols-2 gap-2 h-full">
           {photos[3] && (
            <button
                onClick={() => setCurrentPhotoIndex(3)}
                className="w-full h-full overflow-hidden rounded-lg group"
            >
                <img src={photos[3]} alt="View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </button>
           )}
           {photos[4] && (
            <button
                onClick={() => setCurrentPhotoIndex(4)} 
                className="relative w-full h-full overflow-hidden rounded-lg group"
            >
                <img src={photos[4]} alt="View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {photos.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white group-hover:bg-black/70 transition-colors">
                    <span className="text-xl">+{photos.length - 5} photos</span>
                </div>
                )}
            </button>
           )}
        </div>
      </div>

      {/* --- Lightbox Modal --- */}
      {currentPhotoIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setCurrentPhotoIndex(null)}
        >
          <button
            onClick={() => setCurrentPhotoIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
          >
            <X className="w-10 h-10" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-all z-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={photos[currentPhotoIndex]}
            alt={`Gallery view ${currentPhotoIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-all z-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 text-white/80 text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>

        </div>
      )}
    </>
  );
}