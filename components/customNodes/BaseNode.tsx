import React from 'react';
import { NodeStatus, NodeCategory, BaseNodeData } from '../../types';
import { DotsVerticalIcon } from '../icons';

interface BaseNodeProps {
  data: BaseNodeData;
  children: React.ReactNode;
}

const statusClasses: Record<NodeStatus, string> = {
  [NodeStatus.IDLE]: 'bg-gray-400',
  [NodeStatus.RUNNING]: 'bg-blue-500 animate-pulse',
  [NodeStatus.SUCCESS]: 'bg-green-500',
  [NodeStatus.ERROR]: 'bg-red-500',
};

const categoryClasses: Record<NodeCategory, { pill: string; text: string }> = {
  'io': { pill: 'bg-green-100', text: 'text-green-800' },
  'ai': { pill: 'bg-yellow-100', text: 'text-yellow-800' },
  'logic': { pill: 'bg-blue-100', text: 'text-blue-800' },
  'utility': { pill: 'bg-indigo-100', text: 'text-indigo-800' },
};

const categoryLabels: Record<NodeCategory, string> = {
  'io': 'I/O',
  'ai': 'Action',
  'logic': 'Logic',
  'utility': 'Utility'
};

const BaseNode: React.FC<BaseNodeProps> = ({ data, children }) => {
  const categoryStyle = categoryClasses[data.category] || categoryClasses.utility;
  const categoryLabel = categoryLabels[data.category] || 'Node';

  return (
    <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusClasses[data.status]}`} title={`Status: ${data.status}`}></div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryStyle.pill} ${categoryStyle.text}`}>
             {categoryLabel}
           </span>
          <h3 className="text-sm font-semibold text-gray-900">{data.label}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-700 p-1">
          <DotsVerticalIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 text-sm text-gray-700">
        {children}
      </div>

      {/* Footer */}
      {(data.executionTime !== undefined || data.tokenCount !== undefined) && data.status === NodeStatus.SUCCESS && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-end items-center gap-4">
          {data.tokenCount !== undefined && <span>{data.tokenCount} Tokens</span>}
          {data.executionTime !== undefined && <span>{(data.executionTime / 1000).toFixed(2)}s</span>}
        </div>
      )}
    </div>
  );
};

export default BaseNode;