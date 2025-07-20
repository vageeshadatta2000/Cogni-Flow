import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TextGeneratorNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { SparklesIcon } from '../icons';

const TextGeneratorNode: React.FC<NodeProps<TextGeneratorNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
      {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
      
      {(data.status === NodeStatus.SUCCESS && data.result) ? (
        <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-md text-gray-800 border border-gray-200">
            <p className="text-sm whitespace-pre-wrap break-words">{data.result}</p>
        </div>
      ) : (
        <div className="space-y-2">
            <p className="text-xs text-gray-500">Generates text based on the provided prompt template.</p>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-1">PROMPT</p>
                <p className="text-sm text-gray-800 break-words">{data.prompt}</p>
            </div>
        </div>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default TextGeneratorNode;