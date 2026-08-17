'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';

export default function InstructorClassHub() {
  const params = useParams();
  const classId = params.id as string;
  const [lessons, setLessons] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, fetch from API. We use mock data here for demonstration.
    setLessons([
      { id: '1', title: 'The Creation', category: 'Old Testament', status: 'published' },
      { id: '2', title: 'The Exodus', category: 'Old Testament', status: 'draft' }
    ]);
    setTasks([
      { id: '1', title: 'Genesis Quiz', dueDate: 'Next Sunday', status: 'active', submissions: 12 },
      { id: '2', title: 'Memorize Psalm 23', dueDate: 'In 2 weeks', status: 'draft', submissions: 0 }
    ]);
  }, [classId]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white shadow-xl">
        <h1 className="text-3xl font-extrabold">Class Hub</h1>
        <p className="opacity-80">Manage your lessons, tasks, and students for this class.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-outline-variant bg-surface-container-lowest">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">menu_book</span>Lessons</h3>
              <Link href={`/instructor/lessons/new?classId=${classId}`}>
                <Button size="sm" variant="primary">New Lesson</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {lessons.map(lesson => (
                <div key={lesson.id} className="flex justify-between items-center p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition">
                  <div>
                    <p className="font-bold text-sm">{lesson.title}</p>
                    <p className="text-xs text-on-surface-variant">{lesson.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${lesson.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{lesson.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-outline-variant bg-surface-container-lowest">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">task</span>Tasks & Assignments</h3>
              <Link href={`/instructor/tasks/new?classId=${classId}`}>
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">New Task</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition">
                  <div>
                    <p className="font-bold text-sm">{task.title}</p>
                    <p className="text-xs text-on-surface-variant">Due: {task.dueDate}</p>
                  </div>
                  <Link href={`/instructor/tasks/${task.id}`}>
                    <Button size="sm" variant="secondary" className="h-7 text-xs">{task.submissions} Submissions</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
