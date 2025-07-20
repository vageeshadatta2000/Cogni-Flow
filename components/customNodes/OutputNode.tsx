import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { OutputNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { AudioIcon } from '../icons';

const OutputNode: React.FC<NodeProps<OutputNodeData>> = ({ data }) => {
  const isImage = typeof data.result === 'string' && data.result.startsWith('data:image/');
  
  let resultDisplay;
  if (data.status === NodeStatus.SUCCESS && data.result !== undefined) {
    if (isImage) {
      resultDisplay = <img src={data.result} alt="Final output" className="w-full h-auto rounded-md object-contain" />;
    } else if (typeof data.result === 'object') {
      resultDisplay = <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data.result, null, 2)}</pre>;
    } else if (String(data.result).includes('Audio')) { // Demo for audio output
      resultDisplay = (
        <div className="flex items-center gap-2 p-2 bg-gray-100 border border-gray-200 rounded-md">
            <AudioIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Audio Output</span>
        </div>
      )
    } else {
      resultDisplay = <p className="text-sm whitespace-pre-wrap break-words">{String(data.result)}</p>;
    }
  } else if (data.status === NodeStatus.RUNNING) {
      resultDisplay = <p className="text-gray-400">Waiting for input...</p>;
  } else if (data.status === NodeStatus.ERROR) {
      resultDisplay = <p className="text-red-500">{data.error}</p>;
  } else {
      resultDisplay = <p className="text-gray-400">Workflow output will appear here.</p>;
  }

  return (
    <BaseNode data={data}>
        <div className="min-h-[50px] max-h-80 overflow-y-auto bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200">
            {resultDisplay}
        </div>
      <Handle
        type="target"
        position={Position.Left}
      />
    </BaseNode>
  );
};

export default OutputNode;