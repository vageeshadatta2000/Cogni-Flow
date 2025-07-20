import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { DecisionNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { DecisionIcon } from '../icons';

const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
        {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
        {(data.status === NodeStatus.IDLE || data.status === NodeStatus.RUNNING) && (
             <div className="space-y-2">
                <p className="text-xs text-gray-500">Input is checked if it contains the keyword (case-insensitive):</p>
                <p className="font-mono bg-gray-100 p-2 rounded text-gray-800 break-all text-sm">{data.condition}</p>
             </div>
        )}
        {data.status === NodeStatus.SUCCESS && data.result && (
            <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                <p className="text-sm break-words">{data.result}</p>
            </div>
        )}

      <Handle
        type="target"
        position={Position.Left}
      />
    
        <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: '35%' }}
        />
        <div className="absolute right-[-65px] top-[35%] -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span className="text-xs font-semibold text-gray-500">True</span>
        </div>
      
        <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: '65%' }}
        />
        <div className="absolute right-[-70px] top-[65%] -translate-y-1/2 flex items-center gap-1 pointer-events-none">
           <span className="text-xs font-semibold text-gray-500">False</span>
        </div>
      
    </BaseNode>
  );
};

export default DecisionNode;