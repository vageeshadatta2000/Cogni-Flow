import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MergeNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { MergeIcon } from '../icons';

const MergeNode: React.FC<NodeProps<MergeNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
        {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
        {(data.status === NodeStatus.IDLE || data.status === NodeStatus.RUNNING) && (
             <p className="text-xs text-gray-500">Waits for all connected inputs, then passes them through together as a single text block.</p>
        )}
        {data.status === NodeStatus.SUCCESS && data.result && (
            <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                <p className="text-sm whitespace-pre-wrap break-words">{String(data.result)}</p>
            </div>
        )}

      <Handle
        type="target"
        position={Position.Left}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </BaseNode>
  );
};

export default MergeNode;