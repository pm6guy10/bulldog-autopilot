// File: components/ProjectsList.tsx
"use client";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Project } from "@/lib/types";
import { useEffect, useState } from "react";
const DroppableWrapper = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) { return null; }
  return <Droppable {...props}>{children}</Droppable>;
};
const GripVerticalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="6" r="1.5" fill="#9CA3AF"/><circle cx="14" cy="6" r="1.5" fill="#9CA3AF"/>
    <circle cx="10" cy="12" r="1.5" fill="#9CA3AF"/><circle cx="14" cy="12" r="1.5" fill="#9CA3AF"/>
    <circle cx="10" cy="18" r="1.5" fill="#9CA3AF"/><circle cx="14" cy="18" r="1.5" fill="#9CA3AF"/>
  </svg>
);
type ProjectsListProps = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onReorder: (reorderedProjects: Project[]) => void;
};
export default function ProjectsList({ projects, onEdit, onReorder }: ProjectsListProps) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(projects);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DroppableWrapper droppableId="projects">
        {(provided: any) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {projects.map((p, index) => (
              <Draggable key={p.id} draggableId={String(p.id)} index={index}>
                {(provided: any, snapshot: any) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} className={`flex items-center justify-between p-4 rounded-lg shadow-card transition ${snapshot.isDragging ? "border-2 border-accent-cyan bg-gray-800" : "bg-bg-alt hover:bg-gray-800"}`}>
                    <div {...provided.dragHandleProps} className="cursor-grab" title="Reorder project"><GripVerticalIcon /></div>
                    <div className="flex-grow px-4">
                      <h3 className="text-lg font-semibold text-text-primary">{p.name}</h3>
                      <p className="text-sm text-text-secondary">Project No. {p.project_no || 'N/A'}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(p)} className="px-3 py-1 rounded bg-accent-cyan text-white text-sm font-medium hover:opacity-90 transition">Edit</button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </DroppableWrapper>
    </DragDropContext>
  );
}
