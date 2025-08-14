"use client";

import PublicProjectPage from '~/app/[slug]/PublicProjectPage';
import type { Project } from '~/lib/firestore';

interface ProjectPreviewProps {
    config: any;
}

export default function ProjectPreview({ config }: ProjectPreviewProps) {
    // We create a mock project object here to pass to the PublicProjectPage
    // This allows us to reuse the exact same component for the preview
    const mockProject: Project = {
        id: 'preview-id',
        userId: 'preview-user',
        name: config.name || 'Preview Project',
        slug: 'preview-slug',
        status: 'published',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        config: config,
        stats: {
            totalVisits: 123,
            totalSignups: 45,
            conversionRate: 36.5,
        }
    };

    return (
        <div className="w-full h-full bg-white overflow-y-auto">
             <PublicProjectPage project={mockProject} />
        </div>
    );
} 