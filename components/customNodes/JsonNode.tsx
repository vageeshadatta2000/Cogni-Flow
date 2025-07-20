import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { JSONNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { JsonIcon } from '../icons';

const JsonNode: React.FC<NodeProps<JSONNodeData>> = ({ data }) => {
  const resultDisplay = data.result
    ? (typeof data.result === 'string'
        ? <pre className="text-xs whitespace-pre-wrap">{data.result}</pre>
        : <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data.result, null, 2)}</pre>)
    : null;

  return (
    <BaseNode data={data}>
      {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
      
      {data.status === NodeStatus.SUCCESS && data.result ? (
        <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
          {resultDisplay}
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Operation: <span className="font-semibold capitalize text-gray-700">{data.operation}</span></p>
          <p className="text-xs text-gray-500 mt-1">
            {data.operation === 'parse'
              ? 'Takes a JSON string as input and outputs a JavaScript object.'
              : 'Takes a JavaScript object as input and outputs a formatted JSON string.'}
          </p>
        </div>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default JsonNode;