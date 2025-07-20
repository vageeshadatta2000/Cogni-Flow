import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { InputNodeData } from '../../types';
import BaseNode from './BaseNode';
import { FileIcon } from '../icons';

const InputNode: React.FC<NodeProps<InputNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
      <p className="text-xs text-gray-500 mb-2">Provide the initial input for the workflow. This can be static text or dynamic variables.</p>
      <div className="bg-gray-50 p-2 rounded-md text-gray-800 break-words border border-gray-200 min-h-[40px]">
        {data.text || <span className="text-gray-400">No input set. Select to edit in settings.</span>}
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </BaseNode>
  );
};

export default InputNode;