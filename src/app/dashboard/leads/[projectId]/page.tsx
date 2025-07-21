"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProjectById, getProjectLeads, Project, Lead } from '~/lib/firestore';
import { toast } from 'sonner';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Eye, Users, Percent, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function LeadsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setProject(projectData);
          const leadsData = await getProjectLeads(projectId);
          setLeads(leadsData);
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

  const exportData = (format: 'csv' | 'json' | 'xlsx') => {
    if (leads.length === 0) {
      toast.info('Dışa aktarılacak veri bulunmuyor.');
      return;
    }

    const dataToExport = leads.map(lead => ({
      'Ad Soyad': lead.name || '',
      'E-posta': lead.email,
      'Telefon': lead.phone || '',
      'Kayıt Tarihi': lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const slug = project?.slug || 'leads';

    if (format === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    
    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      XLSX.writeFile(workbook, `${slug}.xlsx`);
    }
  };


  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">Yükleniyor...</div>;
  }

  if (!project) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Proje bulunamadı</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
          Dashboard'a Geri Dön
        </Link>
      </div>
    );
  }

  const stats = [
    { name: 'Toplam Ziyaretçi', stat: project.stats.totalVisits || 0, icon: Eye },
    { name: 'Toplam Kayıt', stat: project.stats.totalSignups || 0, icon: Users },
    { name: 'Dönüşüm Oranı', stat: `${(project.stats.conversionRate || 0).toFixed(2)}%`, icon: Percent },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {project.name}
          </h1>
          <p className="text-muted-foreground">Projenizin kayıtları ve istatistikleri</p>
        </div>
        <Link href={`/dashboard/editor/${project.id}`}>
          <Button variant="outline">Projeyi Düzenle</Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.stat}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Toplanan Veriler</CardTitle>
           <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportData('xlsx')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportData('json')}>
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Ad Soyad</th>
                  <th className="px-6 py-3 font-medium">E-posta</th>
                  <th className="px-6 py-3 font-medium">Telefon</th>
                  <th className="px-6 py-3 font-medium">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leads.length > 0 ? (
                  leads.map(lead => (
                    <tr key={lead.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{lead.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lead.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lead.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      Henüz kayıt bulunmuyor. Projenizin linkini paylaşarak veri toplamaya başlayın!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component, assuming Button is available
function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'default', size?: 'sm' | 'default' }) {
  // A basic button component mock
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const sizeClasses = props.size === 'sm' ? 'h-9 px-3' : 'h-10 px-4 py-2';

  const variantClasses = props.variant === 'outline'
    ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  return <button className={`${baseClasses} ${variantClasses} ${sizeClasses}`} {...props} />;
}
