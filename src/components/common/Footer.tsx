import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ChevronUp,
  CreditCard,
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, PinterestIcon } from './SocialIcons';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC<{
  onOpenTrackOrder: () => void;
  onOpenPolicy: (title: string, content: string) => void;
}> = ({ onOpenTrackOrder, onOpenPolicy }) => {
  const { settings, setActiveTab, setSelectedCategorySlug } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#173B32] text-white pt-16 pb-8 border-t border-[#122E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#FAF5ED]/15">
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/stylenest-logo.png"
                alt="StyleNest"
                className="h-10 w-auto brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Style<span className="text-[#C9684B]">Nest</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#FAF5ED]/80 font-semibold -mt-1">
                  Wear Your Vibe
                </span>
              </div>
            </div>

            <p className="text-sm text-[#FAF5ED]/80 leading-relaxed max-w-sm">
              StyleNest is your one-stop destination for trendy, comfortable and premium clothing for everyone. Curated quality tailored for modern lifestyles.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C9684B] flex items-center justify-center transition-all cursor-pointer"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C9684B] flex items-center justify-center transition-all cursor-pointer"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C9684B] flex items-center justify-center transition-all cursor-pointer"
                title="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.pinterest_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C9684B] flex items-center justify-center transition-all cursor-pointer"
                title="Pinterest"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white border-b border-[#FAF5ED]/20 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF5ED]/80">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('store');
                    setSelectedCategorySlug(null);
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'About StyleNest',
                      'StyleNest was founded with a single mission: to deliver accessible luxury, premium comfort, and contemporary fashion for women, men, and children across Bangladesh. Every thread is responsibly sourced and thoughtfully styled.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Contact Our Team',
                      `You can contact our customer experience team 7 days a week:\n\nPhone: ${settings.phone}\nEmail: ${settings.email}\nAddress: ${settings.address}`
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Privacy Policy',
                      'At StyleNest, your personal privacy and purchase security are strictly protected. We never sell your personal information, phone numbers, or payment credentials to third parties. All transactions are safeguarded with strict encryption.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Terms & Conditions',
                      'Orders placed on StyleNest are subject to stock availability and customer verification. We reserve the right to verify suspicious orders prior to dispatch. Delivery timelines range from 24-48 hours inside Dhaka and 3-5 days outside Dhaka.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white border-b border-[#FAF5ED]/20 pb-2 inline-block">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF5ED]/80">
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Frequently Asked Questions (FAQ)',
                      'Q: How long does delivery take?\nA: 24-48 hours inside Dhaka, 3-5 business days outside Dhaka.\n\nQ: How do I pay?\nA: We accept Cash on Delivery (COD), bKash, Nagad, and Rocket.\n\nQ: Can I check the parcel in front of the courier?\nA: Yes, our delivery partners allow visual inspection.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Shipping Policy',
                      `Free shipping is applicable on all orders above ৳ ${settings.free_shipping_threshold}.\n\nStandard Shipping Rates:\nInside Dhaka: ৳ ${settings.inside_dhaka_shipping}\nOutside Dhaka: ৳ ${settings.outside_dhaka_shipping}`
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Return & Refund Policy',
                      'StyleNest offers a hassle-free 7-day return guarantee. If the product size does not fit, has a manufacturing defect, or differs from what you ordered, contact our support team within 7 days for exchange or full refund.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Return & Refund
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onOpenPolicy(
                      'Size Guide',
                      'Standard Sizing Dimensions (Inches):\n\nSmall (S): Chest 38, Length 27\nMedium (M): Chest 40, Length 28\nLarge (L): Chest 42, Length 29\nExtra Large (XL): Chest 44, Length 30\n\nTraditional Sarees are full 12-hand length with 80cm blouse piece.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition-colors cursor-pointer font-semibold text-[#FAF5ED]"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Payment Methods */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white border-b border-[#FAF5ED]/20 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-[#FAF5ED]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9684B] mt-1 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9684B] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9684B] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                  {settings.email}
                </a>
              </li>
            </ul>

            {/* Payment Method Badges (from screenshot: COD, bKash, Nagad, Rocket) */}
            <div className="pt-3">
              <span className="text-xs uppercase font-semibold text-[#FAF5ED]/90 tracking-wider block mb-2">
                Payment Methods
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* Cash on Delivery Badge */}
                <div className="bg-white/10 px-2.5 py-1.5 rounded flex items-center gap-1.5 text-xs text-white">
                  <CreditCard className="w-3.5 h-3.5 text-[#C9684B]" />
                  <span>Cash on Delivery</span>
                </div>
                {/* bKash */}
                <div className="bg-[#DF146E] text-white px-2.5 py-1.5 rounded text-xs font-bold tracking-tight">
                  bKash
                </div>
                {/* Nagad */}
                <div className="bg-[#F7941D] text-white px-2.5 py-1.5 rounded text-xs font-bold tracking-tight">
                  নগদ
                </div>
                {/* Rocket */}
                <div className="bg-[#8C3494] text-white px-2.5 py-1.5 rounded text-xs font-bold tracking-tight">
                  Rocket
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF5ED]/60 gap-4">
          <p>© {new Date().getFullYear()} StyleNest. All Rights Reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#FAF5ED]/80 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
