import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategorySlug, setActiveTab } = useStore();

  const handleCategorySelect = (slug: string) => {
    setActiveTab('store');
    setSelectedCategorySlug(slug);
    const el = document.getElementById('latest-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeCategories = categories.filter((c) => c.is_active);

  return (
    <section className="py-12 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292824] tracking-tight">
              Shop by Category
            </h2>
            <div className="w-12 h-1 bg-[#173B32] mt-2 rounded-full" />
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              const el = document.getElementById('latest-collection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-[#173B32] hover:text-[#C9684B] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Column Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {activeCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.slug)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-[#FAF5ED] flex flex-col"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#E1ECE7]">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Title & CTA */}
              <div className="p-4 flex flex-col items-center text-center">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#292824] group-hover:text-[#173B32] transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs font-semibold text-[#C9684B] flex items-center gap-1 mt-1 group-hover:gap-1.5 transition-all">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
