import React from 'react';
import { X, Camera } from 'lucide-react';
import { PHOTO_GALLERY } from '../data/marketingData';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Gallery</span>
          </div>
          <h3 className="text-2xl font-bold font-serif text-stone-900">
            라이프업 커뮤니티 & 코칭 현장
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            스스로의 한계를 깨고 더 높이 도약하는 수강생들의 생생한 성장의 순간들입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHOTO_GALLERY.map(item => (
            <div key={item.id} className="group rounded-2xl overflow-hidden border border-stone-200 shadow-xs relative">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3.5 bg-white">
                <h4 className="text-xs font-bold text-stone-900 mt-1">{item.title}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
