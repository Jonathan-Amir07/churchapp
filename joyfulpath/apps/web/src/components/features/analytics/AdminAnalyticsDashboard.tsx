'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';
import { Card, Button, Skeleton } from '@/components/ui';

interface AnalyticsData {
  period: { startDate: string; endDate: string };
  engagementMetrics: {
    averageXp: number;
    totalXp: number;
    activeStudents: number;
  };
  lessonCompletion: Array<{
    lessonId: string;
    title: string;
    completionRate: number;
    total: number;
    completed: number;
  }>;
  quizPerformance: Array<{
    quizId: string;
    title: string;
    attempts: number;
    averageScore: number;
    passRate: number;
  }>;
  topStudents: Array<{
    id: string;
    name: string;
    xp: number;
    points: number;
    streak: number;
    badges: number;
  }>;
  taskSubmissions: Array<{
    taskId: string;
    title: string;
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

export function AdminAnalyticsDashboard({ classId }: { classId?: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const res = await fetch(`/api/analytics?${params}`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [classId, dateRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">No analytics data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card className="p-4 flex gap-4 items-end bg-surface-container-low">
        <div className="flex-1">
          <label className="text-sm font-semibold text-on-surface">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full mt-1 px-3 py-2 border border-outline rounded-lg"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-on-surface">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full mt-1 px-3 py-2 border border-outline rounded-lg"
          />
        </div>
        <Button onClick={fetchAnalytics} className="bg-primary text-on-primary">
          Apply
        </Button>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-surface-container-low">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase">Active Students</h3>
          <p className="text-4xl font-bold text-primary mt-2">{data.engagementMetrics.activeStudents}</p>
        </Card>
        <Card className="p-6 bg-surface-container-low">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase">Average XP</h3>
          <p className="text-4xl font-bold text-secondary mt-2">{data.engagementMetrics.averageXp}</p>
        </Card>
        <Card className="p-6 bg-surface-container-low">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase">Total XP Awarded</h3>
          <p className="text-4xl font-bold text-tertiary mt-2">{data.engagementMetrics.totalXp}</p>
        </Card>
      </div>

      {/* Lesson Completion Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Lesson Completion Rates</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.lessonCompletion.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" fill="#10b981" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quiz Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Quiz Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data.quizPerformance.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="averageScore" fill="#3b82f6" name="Avg Score" />
            <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#10b981" name="Pass Rate %" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Task Submission Status */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Task Submission Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.taskSubmissions.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            <Bar dataKey="approved" fill="#10b981" name="Approved" />
            <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Students Leaderboard */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Top Students</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.topStudents.map((student, idx) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <span className="font-bold text-lg text-secondary w-6">#{idx + 1}</span>
                <div>
                  <p className="font-semibold text-on-surface">{student.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {student.streak} 🔥 • {student.badges} 🏆
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{student.xp} XP</p>
                <p className="text-sm text-on-surface-variant">{student.points} Points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AdminAnalyticsDashboard;
