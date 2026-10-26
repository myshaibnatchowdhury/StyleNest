import React from 'react';
import { X, FileText } from 'lucide-react';

export const PolicyModal: React.FC<{
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FAF5ED] p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#173B32]" />
            <h2 className="font-serif text-lg font-bold text-[#292824]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line pr-1">
          {content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#173B32] text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-[#122E27] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
