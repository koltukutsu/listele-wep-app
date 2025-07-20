"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProjectById, getProjectWaitlistEntries, Project, WaitlistEntry } from '~/lib/firestore';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LeadsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [leads, setLeads] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setProject(projectData);
          const waitlistData = await getProjectWaitlistEntries(projectId);
          setLeads(waitlistData);
        } else {
          toast.error("Proje bulunamadı.");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!project) {
    return (
      <div>
        <h1>Proje bulunamadı</h1>
        <Link href="/dashboard">Geri dön</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        \"{project.name}\" için Kayıtlar
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Toplam {leads.length} kayıt bulundu.
      </p>

      <div className="border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium">Ad Soyad</th>
              <th className="px-6 py-3 font-medium">E-posta</th>
              <th className="px-6 py-3 font-medium">Telefon</th>
              <th className="px-6 py-3 font-medium">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map(lead => (
                <tr key={lead.id} className="border-b">
                  <td className="px-6 py-4">{lead.name || '-'}</td>
                  <td className="px-6 py-4">{lead.email || '-'}</td>
                  <td className="px-6 py-4">{lead.phone || '-'}</td>
                  <td className="px-6 py-4">
                    {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Henüz kayıt bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
