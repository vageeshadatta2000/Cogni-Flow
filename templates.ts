import { Node, Edge } from 'reactflow';
import { NodeID, NodeStatus } from './types';

export interface WorkflowTemplate {
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
}

export const templates: WorkflowTemplate[] = [
    {
        name: 'Competitive Analysis Agent',
        description: 'Searches for news about a competitor, analyzes sentiment, and generates a report.',
        nodes: [
            { id: 'ca-1', type: NodeID.INPUT, position: { x: 50, y: 350 }, data: { label: 'Competitor Name', status: NodeStatus.IDLE, category: 'io', text: 'Apple Inc.' } },
            { id: 'ca-2', type: NodeID.WEB_SEARCH, position: { x: 350, y: 350 }, data: { label: 'Search News', status: NodeStatus.IDLE, category: 'ai', prompt: 'Latest news about {{input}} from the last month' } },
            { id: 'ca-3', type: NodeID.TEXT_GENERATOR, position: { x: 650, y: 350 }, data: { label: 'Analyze Sentiment', status: NodeStatus.IDLE, category: 'ai', prompt: 'Analyze the sentiment of the following news article. Respond with only one word: Positive, Negative, or Neutral.\n\nArticle: {{input}}' } },
            { id: 'ca-4', type: NodeID.DECISION, position: { x: 950, y: 350 }, data: { label: 'Check Sentiment', status: NodeStatus.IDLE, category: 'logic', condition: 'Positive' } },
            { id: 'ca-5', type: NodeID.TEXT_GENERATOR, position: { x: 1250, y: 250 }, data: { label: 'Positive Summary', status: NodeStatus.IDLE, category: 'ai', prompt: 'Write a brief, optimistic summary of this news for an internal stakeholder presentation:\n\n{{input}}' } },
            { id: 'ca-6', type: NodeID.TEXT_GENERATOR, position: { x: 1250, y: 450 }, data: { label: 'Neutral/Negative Summary', status: NodeStatus.IDLE, category: 'ai', prompt: 'Write a brief, neutral summary of this news, highlighting potential risks or challenges for an internal stakeholder presentation:\n\n{{input}}' } },
            { id: 'ca-7', type: NodeID.MERGE, position: { x: 1550, y: 350 }, data: { label: 'Combine Summaries', status: NodeStatus.IDLE, category: 'logic' } },
            { id: 'ca-8', type: NodeID.OUTPUT, position: { x: 1850, y: 350 }, data: { label: 'Final Report', status: NodeStatus.IDLE, category: 'io' } },
        ],
        edges: [
            { id: 'eca1-2', source: 'ca-1', target: 'ca-2', type: 'smoothstep' },
            { id: 'eca2-3', source: 'ca-2', target: 'ca-3', type: 'smoothstep' },
            { id: 'eca3-4', source: 'ca-3', target: 'ca-4', type: 'smoothstep' },
            { id: 'eca4t-5', source: 'ca-4', sourceHandle: 'true', target: 'ca-5', type: 'smoothstep' },
            { id: 'eca4f-6', source: 'ca-4', sourceHandle: 'false', target: 'ca-6', type: 'smoothstep' },
            { id: 'eca5-7', source: 'ca-5', target: 'ca-7', type: 'smoothstep' },
            { id: 'eca6-7', source: 'ca-6', target: 'ca-7', type: 'smoothstep' },
            { id: 'eca7-8', source: 'ca-7', target: 'ca-8', type: 'smoothstep' },
        ]
    },
    {
        name: 'Simple Blog Post Ideas',
        description: 'Provide a topic and get a list of blog post ideas.',
        nodes: [
            { id: '1', type: NodeID.INPUT, position: { x: 100, y: 150 }, data: { label: 'Topic', status: NodeStatus.IDLE, category: 'io', text: 'The future of renewable energy' } },
            { id: '2', type: NodeID.TEXT_GENERATOR, position: { x: 500, y: 150 }, data: { label: 'Blog Idea Generator', status: NodeStatus.IDLE, category: 'ai', prompt: 'Generate 5 blog post titles based on the following topic: {{input}}' } },
            { id: '3', type: NodeID.OUTPUT, position: { x: 900, y: 150 }, data: { label: 'Blog Ideas', status: NodeStatus.IDLE, category: 'io' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
            { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
        ]
    },
    {
        name: 'Content Review & Refine',
        description: 'Checks content for a specific word, then either approves it or rewrites it.',
        nodes: [
            { id: '1', type: NodeID.INPUT, position: { x: 50, y: 200 }, data: { label: 'Content Input', status: NodeStatus.IDLE, category: 'io', text: 'This project is very silly.' } },
            { id: '2', type: NodeID.DECISION, position: { x: 450, y: 200 }, data: { label: 'Review Content', status: NodeStatus.IDLE, category: 'logic', condition: 'silly' } },
            { id: '3', type: NodeID.TEXT_GENERATOR, position: { x: 850, y: 100 }, data: { label: 'Refine Content', status: NodeStatus.IDLE, category: 'ai', prompt: 'Rewrite the following text to sound more professional, while keeping the original meaning: {{input}}' } },
            { id: '4', type: NodeID.OUTPUT, position: { x: 1650, y: 200 }, data: { label: 'Final Content', status: NodeStatus.IDLE, category: 'io' } },
            { id: '5', type: NodeID.MERGE, position: { x: 1250, y: 200 }, data: { label: 'Merge Paths', status: NodeStatus.IDLE, category: 'logic' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
            { id: 'e2t-3', source: '2', sourceHandle: 'true', target: '3', type: 'smoothstep' },
            { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
            { id: 'e2f-5', source: '2', sourceHandle: 'false', target: '5', type: 'smoothstep' },
            { id: 'e5-4', source: '5', target: '4', type: 'smoothstep' },
        ]
    }
];