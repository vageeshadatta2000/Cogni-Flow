import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CodeNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { CodeIcon } from '../icons';

const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

const CodeNode: React.FC<NodeProps<CodeNodeData>> = ({ data }) => {
  const resultDisplay = data.result
    ? (typeof data.result === 'string'
        ? <pre className="text-xs whitespace-pre-wrap">{data.result}</pre>
        : <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data.result, null, 2)}</pre>)
    : null;

  return (
    <BaseNode data={data}>
      <div className="flex items-start gap-2 p-2 mb-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <ExclamationTriangleIcon/>
        <p className="text-xs text-yellow-700">
          <strong>Security Warning:</strong> This node executes custom code. Only run code from trusted sources.
        </p>
      </div>

      {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
      
      {data.status === NodeStatus.SUCCESS && data.result ? (
        <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
          {resultDisplay}
        </div>
      ) : (
        <p className="text-xs text-gray-500">Will execute the custom JavaScript code from settings. The 'input' variable is available.</p>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default CodeNode;