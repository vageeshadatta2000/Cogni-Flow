import React from 'react';
import { Node } from 'reactflow';
import { CustomNodeData, InputNodeData, TextGeneratorNodeData, DecisionNodeData, JSONNodeData, CodeNodeData } from '../types';
import { SparklesIcon, TrashIcon } from './icons';

interface SettingsPanelProps {
  selectedNode: Node<CustomNodeData> | null;
  onUpdateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ selectedNode, onUpdateNodeData, onDeleteNode }) => {
  if (!selectedNode) {
    return (
      <aside className="absolute top-4 right-4 w-96 bg-white p-6 border border-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center text-center z-10">
        <div className="text-gray-400">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
            <h3 className="text-lg font-semibold text-gray-800">No Node Selected</h3>
            <p className="text-sm text-gray-500 mt-1">Click a node on the canvas to view its properties.</p>
        </div>
      </aside>
    );
  }

  const { id, type, data } = selectedNode;

  const handleDataChange = (key: string, value: any) => {
      onUpdateNodeData(id, { [key]: value } as Partial<CustomNodeData>);
  };

  const renderSettings = () => {
    switch (type) {
      case 'input':
        return (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
            <textarea
              id="text"
              value={(data as InputNodeData).text}
              onChange={(e) => handleDataChange('text', e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 min-h-[150px] font-mono"
            />
          </div>
        );
      case 'textGenerator':
      case 'webSearch':
      case 'imageGenerator':
        return (
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt Template
            </label>
            <textarea
              id="prompt"
              value={(data as TextGeneratorNodeData).prompt}
              onChange={(e) => handleDataChange('prompt', e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 min-h-[150px] font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">Use <code className="bg-gray-200 text-indigo-700 font-bold p-1 rounded text-xs">{`{{input}}`}</code> to reference the output from the connected node.</p>
          </div>
        );
      case 'decision':
        return (
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input
              id="condition"
              type="text"
              value={(data as DecisionNodeData).condition}
              onChange={(e) => handleDataChange('condition', e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 font-mono"
            />
             <p className="text-xs text-gray-500 mt-2">The 'true' path is taken if the input text contains this word (case-insensitive).</p>
          </div>
        );
      case 'json':
        return (
           <div>
            <label htmlFor="json-op" className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
            <select
              id="json-op"
              value={(data as JSONNodeData).operation}
              onChange={(e) => handleDataChange('operation', e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
            >
              <option value="parse">Parse (String to Object)</option>
              <option value="stringify">Stringify (Object to String)</option>
            </select>
          </div>
        );
      case 'code':
        return (
           <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Custom JavaScript</label>
            <textarea
              id="code"
              value={(data as CodeNodeData).code}
              onChange={(e) => handleDataChange('code', e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 min-h-[200px] font-mono"
            />
             <p className="text-xs text-gray-500 mt-2">The previous node's output is available as the <code className="bg-gray-200 text-indigo-700 font-bold p-1 rounded text-xs">input</code> variable.</p>
             <p className="text-xs text-amber-600 mt-2">Warning: Executing arbitrary code can be a security risk.</p>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">This node has no configurable properties.</p>;
    }
  };


  return (
    <aside className="absolute top-4 right-4 w-96 bg-white p-6 border border-gray-200 rounded-lg shadow-lg z-10 h-[calc(100%-2rem)] flex flex-col">
      <div className="flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Properties</h2>
        <p className="text-sm text-gray-500 mb-4 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()} Node</p>
      </div>
      <div className="flex-grow space-y-5 overflow-y-auto pr-2">
         <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">Node Label</label>
          <input
            id="label"
            type="text"
            value={data.label}
            onChange={(e) => handleDataChange('label', e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
          />
        </div>
        {renderSettings()}
      </div>
      <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200">
        <button
            onClick={() => onDeleteNode(id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
        >
            <TrashIcon className="w-4 h-4"/>
            Delete Node
        </button>
      </div>
    </aside>
  );
};

export default SettingsPanel;