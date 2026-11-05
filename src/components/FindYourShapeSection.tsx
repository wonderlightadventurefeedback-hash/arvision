import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ShapeItem {
  id: string;
  title: string;
  image: string;
  query: string;
}

export const FindYourShapeSection: React.FC = () => {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useStore();
  const [activeTab, setActiveTab] = useState<'Eyeglasses' | 'Sunglasses'>('Eyeglasses');
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Exact 7 shapes for Eyeglasses matching Image 2
  const eyeglassesShapes: ShapeItem[] = [
    { id: 'eye-square', title: 'SQUARE', image: '/images/shapes/eyeglasses/square.jpg', query: 'Square' },
    { id: 'eye-rectangle', title: 'RECTANGLE', image: '/images/shapes/eyeglasses/rectangle.jpg', query: 'Rectangle' },
    { id: 'eye-round', title: 'ROUND', image: '/images/shapes/eyeglasses/round.jpg', query: 'Round' },
    { id: 'eye-cateye', title: 'CATEYE', image: '/images/shapes/eyeglasses/cateye.jpg', query: 'Cat Eye' },
    { id: 'eye-aviator', title: 'AVIATOR', image: '/images/shapes/eyeglasses/aviator.jpg', query: 'Aviator' },
    { id: 'eye-geometric', title: 'GEOMETRIC', image: '/images/shapes/eyeglasses/geometric.jpg', query: 'Geometric' },
    { id: 'eye-clubmaster', title: 'CLUBMASTER', image: '/images/shapes/eyeglasses/clubmaster.jpg', query: 'Clubmaster' },
  ];

  // Exact 7 shapes for Sunglasses matching Image 3 (note Aviator is 3rd, Round is 4th)
  const sunglassesShapes: ShapeItem[] = [
    { id: 'sun-square', title: 'SQUARE', image: '/images/shapes/sunglasses/square.jpg', query: 'Square' },
    { id: 'sun-rectangle', title: 'RECTANGLE', image: '/images/shapes/sunglasses/rectangle.jpg', query: 'Rectangle' },
    { id: 'sun-aviator', title: 'AVIATOR', image: '/images/shapes/sunglasses/aviator.jpg', query: 'Aviator' },
    { id: 'sun-round', title: 'ROUND', image: '/images/shapes/sunglasses/round.jpg', query: 'Round' },
    { id: 'sun-cateye', title: 'CATEYE', image: '/images/shapes/sunglasses/cateye.jpg', query: 'Cat Eye' },
    { id: 'sun-geometric', title: 'GEOMETRIC', image: '/images/shapes/sunglasses/geometric.jpg', query: 'Geometric' },
    { id: 'sun-clubmaster', title: 'CLUBMASTER', image: '/images/shapes/sunglasses/clubmaster.jpg', query: 'Clubmaster' },
  ];

  const currentShapes = activeTab === 'Eyeglasses' ? eyeglassesShapes : sunglassesShapes;

  const handleTabChange = (tab: 'Eyeglasses' | 'Sunglasses') => {
    setActiveTab(tab);
    // Optionally update activeCategory if switching tabs
    if (activeCategory === 'Eyeglasses' || activeCategory === 'Sunglasses') {
      setActiveCategory(tab);
    }
  };

  const handleShapeClick = (shape: ShapeItem) => {
    setSelectedShapeId(shape.id);
    setActiveCategory(activeTab);
    setSearchQuery(shape.query);

    // Smoothly scroll down to the product catalog
    setTimeout(() => {
      const catalogEl = document.getElementById('product-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white py-10 sm:py-14 border-b border-neutral-100" id="find-your-shape">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section matching Image 2 & 3 */}
        <div className="mb-6">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-neutral-800 mb-2">
            SHAPES TRENDING NOW
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight">
            Find your shape
          </h2>
        </div>

        {/* Tab Switcher: Eyeglasses vs Sunglasses */}
        <div className="relative border-b border-neutral-200">
          <div className="flex items-center gap-8 sm:gap-10">
            <button
              onClick={() => handleTabChange('Eyeglasses')}
              className={`pb-3 text-lg sm:text-xl font-serif tracking-tight transition-all relative cursor-pointer ${
                activeTab === 'Eyeglasses'
                  ? 'text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700 font-normal'
              }`}
            >
              Eyeglasses
              {activeTab === 'Eyeglasses' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-950" />
              )}
            </button>

            <button
              onClick={() => handleTabChange('Sunglasses')}
              className={`pb-3 text-lg sm:text-xl font-serif tracking-tight transition-all relative cursor-pointer ${
                activeTab === 'Sunglasses'
                  ? 'text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700 font-normal'
              }`}
            >
              Sunglasses
              {activeTab === 'Sunglasses' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-950" />
              )}
            </button>
          </div>
        </div>

        {/* Shape Cards Row */}
        <div className="relative mt-8">
          <div
            ref={scrollContainerRef}
            className="flex items-start gap-4 sm:gap-5 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
          >
            {currentShapes.map((shape) => {
              const isSelected =
                selectedShapeId === shape.id ||
                (searchQuery.toLowerCase() === shape.query.toLowerCase() && activeCategory === activeTab);

              return (
                <div
                  key={shape.id}
                  onClick={() => handleShapeClick(shape)}
                  className="flex-shrink-0 w-[124px] sm:w-[136px] md:w-[150px] lg:w-[160px] group cursor-pointer text-center select-none"
                >
                  {/* Image container */}
                  <div
                    className={`aspect-square w-full bg-[#f6f5f3] overflow-hidden transition-all duration-300 relative ${
                      isSelected
                        ? 'ring-2 ring-neutral-950 shadow-md scale-[1.02]'
                        : 'border border-neutral-200/60 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <img
                      src={shape.image}
                      alt={shape.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Active Checkmark Pill */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Shape Name matching screenshots */}
                  <span
                    className={`block mt-3 text-[10.5px] sm:text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
                      isSelected
                        ? 'text-neutral-950 font-bold underline underline-offset-4 decoration-neutral-950'
                        : 'text-neutral-700 group-hover:text-neutral-950'
                    }`}
                  >
                    {shape.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows at bottom right matching screenshots */}
          <div className="flex items-center justify-end gap-2 mt-4 pr-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer"
              aria-label="Previous shapes"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer"
              aria-label="Next shapes"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

