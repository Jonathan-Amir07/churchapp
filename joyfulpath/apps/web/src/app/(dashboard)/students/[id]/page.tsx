'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [siblings, setSiblings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we would get the role from session/context
  const userRole = 'admin'; // Mocking role to show private notes

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        }
        
        const sibRes = await fetch(`/api/users/${id}/siblings`);
        if (sibRes.ok) {
          const sibData = await sibRes.json();
          setSiblings(sibData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (!student) return <div className="p-8">Student not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Profile */}
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
          {student.firstName?.[0]}{student.lastName?.[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-on-surface">{student.displayName || `${student.firstName} ${student.lastName}`}</h1>
          <p className="text-on-surface-variant">@{student.username} • {student.role}</p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-4 py-2 bg-primary/10 rounded-lg">
              <p className="text-xs font-bold text-on-surface-variant">XP</p>
              <p className="text-lg font-black text-primary">{student.totalXp}</p>
            </div>
            <div className="px-4 py-2 bg-secondary/10 rounded-lg">
              <p className="text-xs font-bold text-on-surface-variant">Points</p>
              <p className="text-lg font-black text-secondary">{student.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Education Info */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">Personal & Education</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-medium">Gender</span>
                <span className="text-on-surface font-semibold">{student.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-medium">Date of Birth</span>
                <span className="text-on-surface font-semibold">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-medium">Phone</span>
                <span className="text-on-surface font-semibold">{student.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-medium">Address</span>
                <span className="text-on-surface font-semibold">{student.address || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-medium">School</span>
                <span className="text-on-surface font-semibold">{student.school || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">School Year</span>
                <span className="text-on-surface font-semibold">{student.schoolYear || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Family & Church Info */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">Family</h2>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Parents</h3>
              <p className="text-sm text-on-surface-variant">Linked via Family System (ID: {student.familyId || 'None'})</p>
              
              <h3 className="font-semibold text-primary mt-4">Siblings</h3>
              {siblings.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No siblings found in system.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {siblings.map(sib => (
                    <a key={sib.id} href={`/students/${sib.id}`} className="text-sm text-blue-600 hover:underline">
                      {sib.firstName} {sib.lastName}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Private Notes */}
          {['admin', 'priest', 'instructor'].includes(userRole) && (
            <div className="bg-error/10 rounded-2xl shadow-sm border border-error/20 p-6">
              <h2 className="text-xl font-bold text-error mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                Private Notes
              </h2>
              <p className="text-sm text-on-surface-variant mb-4">
                These notes are only visible to Admins, Priests, and Instructors.
              </p>
              <textarea 
                className="w-full h-24 p-3 rounded-lg border border-outline-variant bg-surface text-sm"
                placeholder="Add a private note about this student..."
              ></textarea>
              <button className="mt-2 bg-error text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-error/90">
                Save Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
