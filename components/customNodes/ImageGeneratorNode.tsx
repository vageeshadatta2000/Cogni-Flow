import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ImageGeneratorNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { ImageGeneratorIcon } from '../icons';

const ImageGeneratorNode: React.FC<NodeProps<ImageGeneratorNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
        {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
        {data.status === NodeStatus.SUCCESS && data.result ? (
            <div className="p-1 bg-gray-50 rounded-md border border-gray-200">
                 <img src={data.result} alt="Generated" className="rounded-md w-full object-contain" />
            </div>
        ) : (
             <div className="space-y-2">
                <p className="text-xs text-gray-500">Generates an image from a descriptive prompt.</p>
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

export default ImageGeneratorNode;