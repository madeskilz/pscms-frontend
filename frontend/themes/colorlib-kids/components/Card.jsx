import React from 'react';

export default function Card({ title, description, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center" style={{ borderTop: '5px solid #ffd200' }}>
      <div className="flex justify-center mb-4">
        <span className="text-4xl" style={{ color: '#f7971e' }}>{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#f7971e' }}>{title}</h3>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  );
}
