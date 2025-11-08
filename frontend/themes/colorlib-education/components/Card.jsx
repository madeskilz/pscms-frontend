import React from 'react';

export default function Card({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ borderTop: '5px solid #8fd3f4' }}>
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)' }}>
          <span className="text-5xl">{icon}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#8fd3f4', fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </div>
  );
}
