// src/components/ui/Card.js
import React from 'react';

/**
 * Komponen Card untuk menampilkan konten dalam bentuk card
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Konten card
 * @param {ReactNode} [props.title] - Judul card (opsional)
 * @param {string} [props.className] - Kelas tambahan
 */
const Card = ({ children, title, className = '', ...rest }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      {...rest}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

/**
 * Header komponen untuk Card
 */
Card.Header = function CardHeader({ children, className = '', ...rest }) {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * Body komponen untuk Card
 */
Card.Body = function CardBody({ children, className = '', ...rest }) {
  return (
    <div 
      className={`p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * Footer komponen untuk Card
 */
Card.Footer = function CardFooter({ children, className = '', ...rest }) {
  return (
    <div 
      className={`px-6 py-4 border-t border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;