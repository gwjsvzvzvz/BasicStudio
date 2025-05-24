
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', imageUrl, imageAlt, onClick }) => {
  const cardClasses = `bg-surface rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-primary/50 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {imageUrl && (
        <img className="w-full h-48 object-cover" src={imageUrl} alt={imageAlt || title || 'Card image'} />
      )}
      <div className="p-6">
        {title && <h3 className="text-xl font-semibold mb-3 text-primary">{title}</h3>}
        <div className="text-textSecondary prose prose-invert max-w-none">{children}</div>
      </div>
    </div>
  );
};

export default Card;
    