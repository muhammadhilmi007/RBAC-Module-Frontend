'use client';

import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiShield, FiEdit, FiLink, FiSlash } from 'react-icons/fi';

/**
 * Komponen untuk menampilkan node pada pohon hierarki
 */
const TreeNode = ({ node, level = 0, onSelectRole, onEditParent, selectedRoleId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedRoleId === node.id;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="role-tree-node">
      <div 
        className={`
          flex items-center py-2 px-2 rounded-md cursor-pointer mb-1
          ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
        `}
        onClick={() => onSelectRole(node)}
      >
        <div className="flex items-center" style={{ marginLeft: `${level * 20}px` }}>
          {hasChildren ? (
            <button 
              className="mr-1 text-gray-500 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation(); 
                toggleExpand();
              }}
            >
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </button>
          ) : (
            <span className="mr-1 w-4"></span>
          )}
          
          <FiShield className={`mr-2 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`} />
          
          <div>
            <div className="font-medium">{node.name}</div>
            {node.description && <div className="text-xs text-gray-500">{node.description}</div>}
          </div>
        </div>
        
        {/* Actions */}
        <div className="ml-auto flex items-center">
          <button 
            className="p-1 text-gray-500 hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              onEditParent(node);
            }}
            title="Edit parent role"
          >
            <FiEdit size={14} />
          </button>
        </div>
      </div>
      
      {/* Children nodes */}
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {node.children.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1}
              onSelectRole={onSelectRole}
              onEditParent={onEditParent}
              selectedRoleId={selectedRoleId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Komponen utama untuk visualisasi hierarki role
 */
const RoleHierarchyTree = ({ hierarchy, onSelectRole, onEditParent, selectedRoleId }) => {
  if (!hierarchy || hierarchy.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Tidak ada data hierarki role
      </div>
    );
  }

  return (
    <div className="role-hierarchy-tree p-2 border border-gray-200 rounded-md bg-white">
      {hierarchy.map(rootNode => (
        <TreeNode 
          key={rootNode.id} 
          node={rootNode}
          onSelectRole={onSelectRole}
          onEditParent={onEditParent}
          selectedRoleId={selectedRoleId}
        />
      ))}
    </div>
  );
};

export default RoleHierarchyTree;