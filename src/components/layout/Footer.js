'use client';

import React from 'react';
import Link from 'next/link';
import { FiHeart, FiClock } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <span className="text-sm text-gray-500">
            &copy; {currentYear} RBAC-ACL System. All rights reserved.
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <FiClock className="w-4 h-4 mr-1" />
            <span>Versi 1.0.0</span>
          </div>
          <span>
            Made with <FiHeart className="w-4 h-4 inline text-red-500 mx-1" /> by Developer
          </span>
        </div>
        
        <div className="mt-2 md:mt-0">
          <ul className="flex space-x-4 text-sm">
            <li>
              <Link href="/help" className="text-gray-500 hover:text-blue-600">
                Bantuan
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-500 hover:text-blue-600">
                Privasi
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-500 hover:text-blue-600">
                Persyaratan
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;