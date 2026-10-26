import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ServiceHighlights: React.FC = () => {
  const { settings } = useStore();

  const services = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: `On orders above ৳ ${settings.free_shipping_threshold}`,
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Within 7 days',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure checkout',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: "We're here to help",
    },
  ];

  return (
    <section className="py-8 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {services.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3.5 sm:space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#F2F6F4] text-[#173B32] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#173B32]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292824] tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#292824]/60 mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
