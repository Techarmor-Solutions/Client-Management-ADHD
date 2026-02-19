import { useState, useEffect } from 'react';
import type { AppView } from '../../types';
import { NavBar } from './NavBar';
import { TaskListView } from '../tasks/TaskListView';
import { ClientListView } from '../clients/ClientListView';
import { ClientDetailView } from '../clients/ClientDetailView';
import { WeeklyReviewView } from '../review/WeeklyReviewView';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';

const VIEW_STORAGE_KEY = 'client-manager-view';

interface AppShellProps {
  onSignOut: () => void;
}

export function AppShell({ onSignOut }: AppShellProps) {
  const [view, setView] = useState<AppView>(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY) as AppView | null;
    return saved && ['tasks', 'clients', 'review'].includes(saved) ? saved : 'tasks';
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { clients, loading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
  const { tasks, loading: tasksLoading, addTask, updateTask, completeTask, uncompleteTask, deleteTask } = useTasks();

  // Persist view to localStorage (except client-detail — persist 'clients')
  useEffect(() => {
    const toSave = view === 'client-detail' ? 'clients' : view;
    localStorage.setItem(VIEW_STORAGE_KEY, toSave);
  }, [view]);

  const handleViewChange = (newView: AppView) => {
    setView(newView);
    if (newView !== 'client-detail') setSelectedClientId(null);
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setView('client-detail');
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      <NavBar
        currentView={view}
        onViewChange={handleViewChange}
        onSignOut={onSignOut}
      />

      <main className="flex-1 flex flex-col">
        {view === 'tasks' && (
          <TaskListView
            tasks={tasks}
            clients={clients}
            projects={projects}
            tasksLoading={tasksLoading || clientsLoading}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onCompleteTask={completeTask}
            onUncompleteTask={uncompleteTask}
            onDeleteTask={deleteTask}
          />
        )}

        {view === 'clients' && (
          <ClientListView
            clients={clients}
            tasks={tasks}
            clientsLoading={clientsLoading}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
            onSelectClient={handleSelectClient}
          />
        )}

        {view === 'client-detail' && selectedClient && (
          <ClientDetailView
            client={selectedClient}
            clients={clients}
            tasks={tasks}
            projects={projects}
            tasksLoading={tasksLoading || projectsLoading}
            onBack={() => handleViewChange('clients')}
            onUpdateClient={updateClient}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onCompleteTask={completeTask}
            onUncompleteTask={uncompleteTask}
            onDeleteTask={deleteTask}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />
        )}

        {view === 'review' && (
          <WeeklyReviewView
            tasks={tasks}
            clients={clients}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onCompleteTask={completeTask}
            onDeleteTask={deleteTask}
            onFinish={() => handleViewChange('tasks')}
          />
        )}
      </main>
    </div>
  );
}
