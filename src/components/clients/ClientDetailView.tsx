import { useState } from 'react';
import type { Client, Task, Project, NewTask, NewProject, TaskStatus } from '../../types';
import { ColorDot } from '../shared/ColorDot';
import { ClientInfoPanel } from './ClientInfoPanel';
import { ProjectSection } from './ProjectSection';
import { ProjectTaskGroup } from './ProjectTaskGroup';
import { QuickAddBar } from '../tasks/QuickAddBar';
import { TaskEditModal } from '../tasks/TaskEditModal';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface ClientDetailViewProps {
  client: Client;
  clients: Client[];
  tasks: Task[];
  projects: Project[];
  tasksLoading: boolean;
  onBack: () => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onAddTask: (task: NewTask) => Promise<unknown>;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onCompleteTask: (id: string) => void;
  onUncompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddProject: (project: NewProject) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export function ClientDetailView({
  client,
  clients,
  tasks,
  projects,
  tasksLoading,
  onBack,
  onUpdateClient,
  onAddTask,
  onUpdateTask,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ClientDetailViewProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const clientTasks = tasks.filter(t => t.client_id === client.id);
  const clientProjects = projects.filter(p => p.client_id === client.id);

  const unassignedTasks = clientTasks.filter(
    t => t.project_id === null || !clientProjects.find(p => p.id === t.project_id)
  );

  const handleStatusChange = (id: string, status: TaskStatus) => {
    onUpdateTask(id, { status });
  };

  if (tasksLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="text-[#6B6860] hover:text-[#1C1B18] flex items-center gap-1 text-sm min-touch"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Clients
          </button>

          <div className="flex items-center gap-2">
            <ColorDot color={client.color} />
            <h1 className="text-xl font-bold text-[#1C1B18]">{client.name}</h1>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1">
            <ClientInfoPanel
              client={client}
              onUpdate={updates => onUpdateClient(client.id, updates)}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <ProjectSection
                clientId={client.id}
                projects={clientProjects}
                onAdd={onAddProject}
                onUpdate={onUpdateProject}
                onDelete={onDeleteProject}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks grouped by project */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-4 flex flex-col gap-3">
        {clientProjects.map(project => (
          <ProjectTaskGroup
            key={project.id}
            project={project}
            tasks={clientTasks.filter(t => t.project_id === project.id)}
            clients={clients}
            defaultOpen={project.status === 'active'}
            onComplete={onCompleteTask}
            onUncomplete={onUncompleteTask}
            onEdit={setEditingTask}
            onDelete={onDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}

        {(unassignedTasks.length > 0 || clientProjects.length === 0) && (
          <ProjectTaskGroup
            project={null}
            tasks={unassignedTasks}
            clients={clients}
            defaultOpen={unassignedTasks.length > 0}
            onComplete={onCompleteTask}
            onUncomplete={onUncompleteTask}
            onEdit={setEditingTask}
            onDelete={onDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* Quick add pre-selects this client */}
      <QuickAddBar
        clients={clients}
        defaultClientId={client.id}
        onAdd={onAddTask}
      />

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          clients={clients}
          projects={clientProjects}
          onSave={onUpdateTask}
          onDelete={onDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
