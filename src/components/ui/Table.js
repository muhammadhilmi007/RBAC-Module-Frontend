// src/components/ui/Table.js
import React from 'react';

/**
 * Komponen Tabel responsif
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Konten tabel
 * @param {string} [props.className] - Kelas tambahan
 */
const Table = ({ children, className = '', ...rest }) => {
  return (
    <div className="overflow-x-auto">
      <table 
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
};

/**
 * Header komponen untuk Table
 */
Table.Head = function TableHead({ children, className = '', ...rest }) {
  return (
    <thead 
      className={`bg-gray-50 ${className}`}
      {...rest}
    >
      {children}
    </thead>
  );
};

/**
 * Header row komponen untuk Table
 */
Table.HeadRow = function TableHeadRow({ children, className = '', ...rest }) {
  return (
    <tr 
      className={className}
      {...rest}
    >
      {children}
    </tr>
  );
};

/**
 * Header cell komponen untuk Table
 */
Table.HeadCell = function TableHeadCell({ children, className = '', ...rest }) {
  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
};

/**
 * Body komponen untuk Table
 */
Table.Body = function TableBody({ children, className = '', ...rest }) {
  return (
    <tbody 
      className={`bg-white divide-y divide-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </tbody>
  );
};

/**
 * Body row komponen untuk Table
 */
Table.Row = function TableRow({ children, className = '', ...rest }) {
  return (
    <tr 
      className={`hover:bg-gray-50 ${className}`}
      {...rest}
    >
      {children}
    </tr>
  );
};

/**
 * Body cell komponen untuk Table
 */
Table.Cell = function TableCell({ children, className = '', ...rest }) {
  return (
    <td 
      className={`px-6 py-4 whitespace-nowrap ${className}`}
      {...rest}
    >
      {children}
    </td>
  );
};

/**
 * Footer komponen untuk Table
 */
Table.Footer = function TableFooter({ children, className = '', ...rest }) {
  return (
    <tfoot 
      className={`bg-gray-50 ${className}`}
      {...rest}
    >
      {children}
    </tfoot>
  );
};

export default Table;