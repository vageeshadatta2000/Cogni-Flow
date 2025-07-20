import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WebSearchNodeData, NodeStatus } from '../../types';
import BaseNode from './BaseNode';
import { WebSearchIcon } from '../icons';

const WebSearchNode: React.FC<NodeProps<WebSearchNodeData>> = ({ data }) => {
  return (
    <BaseNode data={data}>
        {data.status === NodeStatus.ERROR && <p className="text-red-500 bg-red-50 p-2 rounded-md text-xs mb-2 break-all">{data.error}</p>}
        
        {data.status === NodeStatus.SUCCESS && data.result ? (
            <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-md space-y-2 text-gray-800 border border-gray-200">
                <p className="text-sm break-words whitespace-pre-wrap">{data.result}</p>
                {data.sources && data.sources.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-500">Sources:</h4>
                        <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            {data.sources.map((source, index) => (
                                <li key={index} className="truncate">
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{source.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-2">
                <p className="text-xs text-gray-500">Performs a web search based on the prompt.</p>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">QUERY</p>
                    <p className="text-sm text-gray-800 break-words">{data.prompt}</p>
                </div>
            </div>
        )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default WebSearchNode;