import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant
} from 'reactflow';
import {
  CustomNodeData,
  NodeID,
  NodeStatus,
  InputNodeData,
  TextGeneratorNodeData,
  DecisionNodeData,
  WebSearchNodeData,
  ImageGeneratorNodeData,
  OutputNodeData,
  JSONNodeData,
  CodeNodeData,
  MergeNodeData,
} from './types';
import { runTextGeneration, runWebSearch, runImageGeneration } from './services/aiService';
import { templates, WorkflowTemplate } from './templates';

import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import { PlayIcon, StopIcon } from './components/icons';
import InputNode from './components/customNodes/InputNode';
import TextGeneratorNode from './components/customNodes/TextGeneratorNode';
import OutputNode from './components/customNodes/OutputNode';
import DecisionNode from './components/customNodes/DecisionNode';
import WebSearchNode from './components/customNodes/WebSearchNode';
import ImageGeneratorNode from './components/customNodes/ImageGeneratorNode';
import JsonNode from './components/customNodes/JsonNode';
import CodeNode from './components/customNodes/CodeNode';
import MergeNode from './components/customNodes/MergeNode';

const initialNodes: Node<CustomNodeData>[] = templates[0].nodes;
const initialEdges: Edge[] = templates[0].edges;

let id = 100; // Start id high to avoid collision with templates
const getUniqueNodeId = () => `${id++}`;

const Header: React.FC<{onRun: () => void; isExecuting: boolean}> = ({onRun, isExecuting}) => (
    <header className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-2 flex justify-between items-center z-40">
        <div className="flex-1"> {/* Left empty spacer */}</div>
        
        <div className="flex-1 flex justify-center items-center gap-2">
             {['Workflow', 'Export', 'Analytics', 'Manager'].map((item, index) => (
                <button key={item} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${index === 0 ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
                    {item}
                </button>
            ))}
        </div>

        <div className="flex-1 flex justify-end items-center gap-3">
             <button className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Share</button>
             <button onClick={onRun} disabled={isExecuting} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 border border-gray-800 rounded-lg shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-wait transition-all">
                {isExecuting ? <StopIcon className="w-5 h-5 animate-pulse"/> : <PlayIcon className="w-5 h-5"/>}
                {isExecuting ? 'Running...' : 'Run'}
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700">Publish</button>
        </div>
    </header>
);

const FooterControls = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-1">
            <button onClick={() => zoomOut()} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md">-</button>
            <button onClick={() => fitView()} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md text-xs">Fit</button>
            <button onClick={() => zoomIn()} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md">+</button>
        </div>
    );
};


const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const { project } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const nodeTypes = useMemo(() => ({
    [NodeID.INPUT]: InputNode,
    [NodeID.TEXT_GENERATOR]: TextGeneratorNode,
    [NodeID.OUTPUT]: OutputNode,
    [NodeID.DECISION]: DecisionNode,
    [NodeID.WEB_SEARCH]: WebSearchNode,
    [NodeID.IMAGE_GENERATOR]: ImageGeneratorNode,
    [NodeID.JSON]: JsonNode,
    [NodeID.CODE]: CodeNode,
    [NodeID.MERGE]: MergeNode,
  }), []);

  const proOptions = { hideAttribution: true };

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: isExecuting }, eds)), [setEdges, isExecuting]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);
  
  const onNodesDelete = useCallback((deleted: Node[]) => {
    if (selectedNode && deleted.some(n => n.id === selectedNode.id)) {
        setSelectedNode(null);
    }
  }, [selectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowWrapper.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow') as NodeID;

    if (typeof type === 'undefined' || !type) return;

    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    let baseData: CustomNodeData;
    
    switch (type) {
        case NodeID.INPUT:
            baseData = { label: 'Input', status: NodeStatus.IDLE, category: 'io', text: '' };
            break;
        case NodeID.OUTPUT:
            baseData = { label: 'Output', status: NodeStatus.IDLE, category: 'io' };
            break;
        case NodeID.TEXT_GENERATOR:
            baseData = { label: 'AI Text', status: NodeStatus.IDLE, category: 'ai', prompt: '{{input}}' };
            break;
        case NodeID.WEB_SEARCH:
            baseData = { label: 'Web Search', status: NodeStatus.IDLE, category: 'ai', prompt: '{{input}}' };
            break;
        case NodeID.IMAGE_GENERATOR:
            baseData = { label: 'AI Image', status: NodeStatus.IDLE, category: 'ai', prompt: 'A photorealistic image of: {{input}}' };
            break;
        case NodeID.DECISION:
            baseData = { label: 'Decision', status: NodeStatus.IDLE, category: 'logic', condition: 'example' };
            break;
        case NodeID.MERGE:
            baseData = { label: 'Merge', status: NodeStatus.IDLE, category: 'logic' };
            break;
        case NodeID.JSON:
            baseData = { label: 'JSON Tool', status: NodeStatus.IDLE, category: 'utility', operation: 'parse' };
            break;
        case NodeID.CODE:
            baseData = { label: 'Code', status: NodeStatus.IDLE, category: 'utility', code: 'return input;' };
            break;
        default:
            return;
    }

    const newNode: Node<CustomNodeData> = {
      id: getUniqueNodeId(),
      type,
      position,
      data: baseData,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [project, setNodes]);

  const updateNodeData = useCallback((nodeId: string, data: Partial<CustomNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
     if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...data } } : null);
    }
  }, [selectedNode, setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);
  
  const resetWorkflowStatus = useCallback(() => {
    setNodes(nds => nds.map(n => ({...n, data: {...n.data, status: NodeStatus.IDLE, result: undefined, error: undefined, sources: undefined, executionTime: undefined, tokenCount: undefined }})));
  }, [setNodes]);

  const runWorkflow = async () => {
    setIsExecuting(true);
    resetWorkflowStatus();

    const nodeMap = new Map(nodes.map(n => [n.id, { ...n }]));
    const adj = new Map<string, string[]>();
    const revAdj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(n => {
        adj.set(n.id, []);
        revAdj.set(n.id, []);
        inDegree.set(n.id, 0);
    });

    edges.forEach(e => {
        adj.get(e.source)?.push(e.target);
        revAdj.get(e.target)?.push(e.source);
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    });
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    for (const node of nodes) {
        if (detectCycle(node.id, visited, recursionStack, adj)) {
            alert("Error: Workflow has a cycle and cannot be executed.");
            setIsExecuting(false);
            return;
        }
    }

    const queue = nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
    const results = new Map<string, any>();

    while(queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = nodeMap.get(nodeId)! as Node<CustomNodeData>;
        updateNodeData(nodeId, { status: NodeStatus.RUNNING });
        const startTime = performance.now();

        try {
            const parentNodeIds = revAdj.get(nodeId) || [];
            const parentResults = parentNodeIds.map(pid => results.get(pid)).filter(r => r !== undefined);
            
            let input: any;
            if (node.type === NodeID.MERGE) {
                input = parentResults.map(r => typeof r === 'object' ? JSON.stringify(r) : String(r)).join('\n\n---\n\n');
            } else if (parentResults.length > 0) {
                input = parentResults.map(r => typeof r === 'object' ? JSON.stringify(r) : String(r)).join(' ');
            } else {
                input = '';
            }
            
            let output: any;
            let tokenCount: number | undefined;

            switch(node.type) {
                case NodeID.INPUT:
                    output = (node.data as InputNodeData).text;
                    break;
                case NodeID.TEXT_GENERATOR:
                    const tgPrompt = (node.data as TextGeneratorNodeData).prompt.replace(/{{input}}/g, input);
                    const tgResult = await runTextGeneration(tgPrompt);
                    output = tgResult.text;
                    tokenCount = tgResult.tokenCount;
                    break;
                case NodeID.WEB_SEARCH:
                    const wsPrompt = (node.data as WebSearchNodeData).prompt.replace(/{{input}}/g, input);
                    const searchResult = await runWebSearch(wsPrompt);
                    output = searchResult.text;
                    tokenCount = searchResult.tokenCount;
                    updateNodeData(nodeId, { sources: searchResult.sources });
                    break;
                case NodeID.IMAGE_GENERATOR:
                     const igPrompt = (node.data as ImageGeneratorNodeData).prompt.replace(/{{input}}/g, input);
                     output = await runImageGeneration(igPrompt);
                    break;
                case NodeID.DECISION:
                    const condition = (node.data as DecisionNodeData).condition.toLowerCase();
                    const decision = String(input).toLowerCase().includes(condition);
                    output = input; // Pass through
                    const endTime = performance.now();
                    results.set(nodeId, output);
                    updateNodeData(nodeId, { status: NodeStatus.SUCCESS, result: `Input text ${decision ? "contains" : "does not contain"} "${condition}".`, executionTime: endTime - startTime });
                    
                    const nextEdge = edges.find(e => e.source === nodeId && e.sourceHandle === String(decision));
                    if(nextEdge) {
                        const targetId = nextEdge.target;
                        inDegree.set(targetId, (inDegree.get(targetId) || 1) - 1);
                        if (inDegree.get(targetId) === 0) queue.push(targetId);
                    }
                    continue; // Skip normal downstream processing
                case NodeID.JSON:
                    const { operation } = node.data as JSONNodeData;
                    if (operation === 'parse') {
                        output = JSON.parse(input);
                    } else { // stringify
                        output = JSON.stringify(input, null, 2);
                    }
                    break;
                case NodeID.CODE:
                    const { code } = node.data as CodeNodeData;
                    const codeFunction = new Function('input', code);
                    output = await Promise.resolve(codeFunction(input));
                    break;
                case NodeID.MERGE:
                case NodeID.OUTPUT:
                     output = input;
                    break;
            }
            
            const endTime = performance.now();
            results.set(nodeId, output);
            updateNodeData(nodeId, { status: NodeStatus.SUCCESS, result: output, executionTime: endTime - startTime, tokenCount });

            const downstreamNodes = adj.get(nodeId) || [];
            for(const nextNodeId of downstreamNodes) {
                inDegree.set(nextNodeId, (inDegree.get(nextNodeId) || 1) - 1);
                if (inDegree.get(nextNodeId) === 0) queue.push(nextNodeId);
            }

        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
             const endTime = performance.now();
             updateNodeData(nodeId, { status: NodeStatus.ERROR, error: errorMessage, executionTime: endTime - startTime });
             setIsExecuting(false);
             return;
        }
    }
    setIsExecuting(false);
  };

  const detectCycle = (nodeId: string, visited: Set<string>, recursionStack: Set<string>, adj: Map<string, string[]>): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
              if (detectCycle(neighborId, visited, recursionStack, adj)) return true;
          } else if (recursionStack.has(neighborId)) {
              return true;
          }
      }
      recursionStack.delete(nodeId);
      return false;
  }

  return (
    <div className="w-screen h-screen flex flex-col font-sans bg-gray-50 text-gray-900 overflow-hidden">
        <Header onRun={runWorkflow} isExecuting={isExecuting}/>
        <main className="flex-grow h-full relative" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodesDelete={onNodesDelete}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                fitView
                defaultEdgeOptions={{ type: 'smoothstep' }}
            >
                <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
                <Sidebar />
                <SettingsPanel selectedNode={selectedNode} onUpdateNodeData={updateNodeData} onDeleteNode={deleteNode}/>
                <FooterControls />
            </ReactFlow>
        </main>
    </div>
  );
};

export default App;