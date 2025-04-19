'use client';

import React, { useState } from 'react';
import { FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const PermissionTable = ({ permissions, allRoles }) => {
  const [expandedFeatures, setExpandedFeatures] = useState({});

  const toggleFeature = (featureId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  // Function to get role name from ID
  const getRoleName = (roleId) => {
    const role = allRoles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  // Count permissions and inherited permissions
  const countPermissions = () => {
    let total = 0;
    let inherited = 0;
    
    permissions.forEach(featureItem => {
      total += featureItem.permissions.length;
      inherited += featureItem.permissions.filter(p => p.inherited).length;
    });
    
    return { total, inherited, direct: total - inherited };
  };

  const permissionCounts = countPermissions();

  return (
    <div className="permission-table">
      {/* Summary info */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-sm text-gray-500">Total Permissions:</span>
            <span className="ml-2 font-medium">{permissionCounts.total}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Direct:</span>
            <span className="ml-2 font-medium">{permissionCounts.direct}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Inherited:</span>
            <span className="ml-2 font-medium">{permissionCounts.inherited}</span>
          </div>
        </div>
      </div>
      
      {/* Permissions by feature */}
      <div className="space-y-3">
        {permissions.map(featureItem => (
          <div 
            key={featureItem.feature.id} 
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            {/* Feature header */}
            <div 
              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
              onClick={() => toggleFeature(featureItem.feature.id)}
            >
              <div>
                <h3 className="font-medium">{featureItem.feature.name}</h3>
                <p className="text-xs text-gray-500">{featureItem.feature.route || 'No route'}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">
                  {featureItem.permissions.length} permissions
                  {featureItem.permissions.some(p => p.inherited) && 
                    ` (${featureItem.permissions.filter(p => p.inherited).length} inherited)`
                  }
                </span>
                <button className="p-1 rounded-full hover:bg-gray-200">
                  {expandedFeatures[featureItem.feature.id] ? 
                    <FiXCircle className="text-gray-500" /> : 
                    <FiCheckCircle className="text-gray-500" />
                  }
                </button>
              </div>
            </div>
            
            {/* Feature permissions */}
            {expandedFeatures[featureItem.feature.id] && (
              <div className="p-3 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {featureItem.permissions.map(permission => (
                    <div 
                      key={permission.id}
                      className={`
                        p-2 rounded-md border 
                        ${permission.inherited 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-green-50 border-green-200'}
                      `}
                    >
                      <div className="flex items-center">
                        {permission.inherited ? (
                          <FiInfo className="text-yellow-500 mr-2" />
                        ) : (
                          <FiCheckCircle className="text-green-500 mr-2" />
                        )}
                        <span className="font-medium">{permission.name}</span>
                      </div>
                      
                      {permission.inherited && permission.sourceRoleId && (
                        <div className="mt-1 text-xs text-yellow-700">
                          Inherited from: {getRoleName(permission.sourceRoleId)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <span className="flex items-center mr-4">
          <FiCheckCircle className="text-green-500 mr-1" />
          Direct permission
        </span>
        <span className="flex items-center">
          <FiInfo className="text-yellow-500 mr-1" />
          Inherited permission
        </span>
      </div>
    </div>
  );
};

export default PermissionTable;