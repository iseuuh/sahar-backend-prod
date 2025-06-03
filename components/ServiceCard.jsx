import React from 'react';

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-noir/80 border border-gold rounded-lg p-6 flex flex-col items-center text-center hover:bg-noir/90 transition">
      <div className="text-gold text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gold mb-2">{title}</h3>
      <p className="text-sm text-rose">{description}</p>
    </div>
  );
} 