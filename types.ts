export enum NodeID {
  INPUT = 'input',
  OUTPUT = 'output',
  TEXT_GENERATOR = 'textGenerator',
  DECISION = 'decision',
  WEB_SEARCH = 'webSearch',
  IMAGE_GENERATOR = 'imageGenerator',
  JSON = 'json',
  CODE = 'code',
  MERGE = 'merge',
}

export enum NodeStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type NodeCategory = 'io' | 'ai' | 'logic' | 'utility';

export interface BaseNodeData {
  label: string;
  status: NodeStatus;
  category: NodeCategory;
  result?: any; // Can be string, object, etc.
  error?: string;
  executionTime?: number; // in milliseconds
  tokenCount?: number;
}

export interface InputNodeData extends BaseNodeData {
  text: string;
}

export interface TextGeneratorNodeData extends BaseNodeData {
  prompt: string;
}

export interface OutputNodeData extends BaseNodeData {
  // No specific data needed, inherits from Base
}

export interface DecisionNodeData extends BaseNodeData {
  condition: string;
}

export interface WebSearchNodeData extends BaseNodeData {
  prompt: string;
  sources?: { uri: string; title: string }[];
}

export interface ImageGeneratorNodeData extends BaseNodeData {
  prompt: string;
  // result will be a base64 image string
}

export interface JSONNodeData extends BaseNodeData {
    operation: 'parse' | 'stringify';
}

export interface CodeNodeData extends BaseNodeData {
    code: string;
}

export interface MergeNodeData extends BaseNodeData {
    // No specific data needed
}


export type CustomNodeData =
  | InputNodeData
  | TextGeneratorNodeData
  | OutputNodeData
  | DecisionNodeData
  | WebSearchNodeData
  | ImageGeneratorNodeData
  | JSONNodeData
  | CodeNodeData
  | MergeNodeData;