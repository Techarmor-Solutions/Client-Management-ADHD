import { useState } from 'react';
import type { Task, Client, NewTask } from '../../types';
import { ReviewProgressBar } from './ReviewProgressBar';
import { ReviewStep1Catchup } from './ReviewStep1Catchup';
import { ReviewStep2Clients } from './ReviewStep2Clients';
import { ReviewStep3Plan } from './ReviewStep3Plan';
import { ReviewStep4Done } from './ReviewStep4Done';

type ReviewStep = 0 | 1 | 2 | 3;

const STEP_LABELS = ['Catch up', 'Clients', 'Plan week', 'Done'];

interface WeeklyReviewViewProps {
  tasks: Task[];
  clients: Client[];
  onAddTask: (task: NewTask) => Promise<unknown>;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onFinish: () => void;
}

export function WeeklyReviewView({
  tasks,
  clients,
  onAddTask,
  onUpdateTask,
  onCompleteTask,
  onDeleteTask,
  onFinish,
}: WeeklyReviewViewProps) {
  const [step, setStep] = useState<ReviewStep>(0);

  const next = () => setStep(s => Math.min(s + 1, 3) as ReviewStep);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-24">
      <ReviewProgressBar currentStep={step} totalSteps={4} labels={STEP_LABELS} />

      {step === 0 && (
        <ReviewStep1Catchup
          tasks={tasks}
          clients={clients}
          onComplete={id => { onCompleteTask(id); }}
          onReschedule={(id, date) => onUpdateTask(id, { due_date: date })}
          onDelete={id => { onDeleteTask(id); }}
          onNext={next}
        />
      )}

      {step === 1 && (
        <ReviewStep2Clients
          clients={clients}
          tasks={tasks}
          onAddTask={onAddTask}
          onNext={next}
        />
      )}

      {step === 2 && (
        <ReviewStep3Plan
          tasks={tasks}
          clients={clients}
          onUpdateTask={onUpdateTask}
          onNext={next}
        />
      )}

      {step === 3 && (
        <ReviewStep4Done
          tasks={tasks}
          clients={clients}
          onStartWeek={onFinish}
        />
      )}
    </div>
  );
}
