import React, { useState } from 'react';
import { NodeID } from '../types';
import { 
    PlusIcon, HistoryIcon, SettingsIcon, FileIcon, UrlIcon, AudioIcon, ImageGeneratorIcon, SparklesIcon,
    WebSearchIcon, DecisionIcon, MergeIcon, JsonIcon, CodeIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon, CloseIcon, CogniFlowIcon
} from './icons';

interface DraggableNodeProps {
  type: NodeID;
  label: string;
  icon: React.ReactNode;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-2 mb-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-grab flex items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all duration-200"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
  );
};

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-2 text-left">
                <span className="text-sm font-semibold text-gray-500">{title}</span>
                {isOpen ? <ChevronDownIcon className="w-5 h-5 text-gray-400" /> : <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
            </button>
            {isOpen && <div className="pl-2">{children}</div>}
        </div>
    );
};


const AddElementsPanel = ({ onClose }: { onClose: () => void }) => {
    // In a real app, search term would be used to filter nodes
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="absolute top-0 left-12 h-full w-72 bg-white border-r border-gray-200 shadow-lg z-20 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Add Elements</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                    <CloseIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                <CollapsibleSection title="Inputs">
                    <DraggableNode type={NodeID.INPUT} label="Text" icon={<FileIcon/>} />
                    {/* Add URL, Audio, etc. here in a real app */}
                </CollapsibleSection>
                 <CollapsibleSection title="Outputs">
                    <DraggableNode type={NodeID.OUTPUT} label="Output" icon={<FileIcon/>} />
                 </CollapsibleSection>
                <CollapsibleSection title="LLMs">
                    <DraggableNode type={NodeID.TEXT_GENERATOR} label="AI Text" icon={<SparklesIcon className="text-indigo-500"/>} />
                    <DraggableNode type={NodeID.WEB_SEARCH} label="Web Search" icon={<WebSearchIcon className="text-indigo-500"/>} />
                    <DraggableNode type={NodeID.IMAGE_GENERATOR} label="AI Image" icon={<ImageGeneratorIcon className="text-indigo-500"/>} />
                </CollapsibleSection>
                <CollapsibleSection title="Logic">
                    <DraggableNode type={NodeID.DECISION} label="Decision" icon={<DecisionIcon/>} />
                    <DraggableNode type={NodeID.MERGE} label="Merge" icon={<MergeIcon/>} />
                </CollapsibleSection>
                <CollapsibleSection title="Utils">
                    <DraggableNode type={NodeID.JSON} label="JSON" icon={<JsonIcon/>} />
                    <DraggableNode type={NodeID.CODE} label="Code" icon={<CodeIcon/>} />
                </CollapsibleSection>
            </div>
        </div>
    );
};

const NavIcon = ({ icon, isActive, onClick }: { icon: React.ReactNode, isActive?: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}>
        {icon}
    </button>
);

const Sidebar = () => {
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(true);

    return (
        <>
            <aside className="absolute top-0 left-0 h-full w-12 bg-white border-r border-gray-200 z-30 p-2 flex flex-col items-center gap-4">
                <div className="mb-2">
                   <CogniFlowIcon className="w-7 h-7 text-gray-800" />
                </div>
                <NavIcon icon={<PlusIcon className="w-6 h-6"/>} isActive={isAddPanelOpen} onClick={() => setIsAddPanelOpen(v => !v)} />
                <NavIcon icon={<HistoryIcon className="w-6 h-6"/>} onClick={() => { /* Placeholder */ }} />
                <NavIcon icon={<SettingsIcon className="w-6 h-6"/>} onClick={() => { /* Placeholder */ }} />
            </aside>
            {isAddPanelOpen && <AddElementsPanel onClose={() => setIsAddPanelOpen(false)} />}
        </>
    );
};

export default Sidebar;