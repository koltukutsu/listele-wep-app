"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Project, Lead } from '~/lib/firestore';
import { addLead } from '~/lib/firestore';
import { trackConversion } from '~/lib/analytics';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Clock, BarChart2, Archive, Zap, Award, FileText, Check } from 'lucide-react';

interface PublicProjectPageProps {
  project: Project;
}

const benefitIcons = [
  Clock, BarChart2, Archive, Zap, Award, FileText
];

export default function PublicProjectPage({ project }: PublicProjectPageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate email if it's enabled in the form configuration
    if (project.config.formFields.email && !formData.email) {
      setError('E-posta adresi zorunludur.');
      return;
    }
    
    // If email field is disabled but no other fields are filled, show error
    if (!project.config.formFields.email && !formData.name && !formData.phone) {
      setError('Lütfen en az bir alanı doldurun.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addLead(project.id, {
        name: formData.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
      });
      
      // Track conversion for successful signup
      await trackConversion('waitlist_signup', 1, {
        project_id: project.id,
        project_name: project.name,
        email_domain: formData.email ? formData.email.split('@')[1] : null,
        signup_source: 'project_page',
        has_name: !!formData.name,
        has_phone: !!formData.phone,
        has_email: !!formData.email
      });
      
      setSubmitted(true);
    } catch (err) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-lg">
           <h2 className="text-3xl font-bold mb-2">{project.config.thankYouMessage || "Harika! Aramıza Hoş Geldin."}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bu yolculukta ilk adımı attın. Gelişmelerden seni haberdar edeceğiz. Geleceği birlikte inşa edeceğimiz için heyecanlıyız!
            </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.config.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{project.config.subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            {project.config.formFields.name && (
              <input
                type="text"
                name="name"
                placeholder="Adın ve Soyadın"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-offset-2"
                style={{'--tw-ring-color': project.config.accentColor} as React.CSSProperties}
              />
            )}
            {project.config.formFields.email && (
              <input
                type="email"
                name="email"
                placeholder="E-posta Adresin"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-offset-2"
                style={{'--tw-ring-color': project.config.accentColor} as React.CSSProperties}
              />
            )}
            {project.config.formFields.phone && (
              <input
                type="tel"
                name="phone"
                placeholder="Telefon Numaran"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-offset-2"
                style={{'--tw-ring-color': project.config.accentColor} as React.CSSProperties}
              />
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md font-bold text-lg transition-transform hover:scale-105 disabled:opacity-70"
              style={{ backgroundColor: project.config.accentColor, color: project.config.backgroundColor }}
            >
              {loading ? 'Gönderiliyor...' : project.config.buttonText}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
              Verileriniz yalnızca erken erişim duyuruları için kullanılacaktır. Spam gönderilmez.
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      {project.config.benefits && project.config.benefits.length > 0 && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-slate-800">
          <div className="container mx-auto max-w-5xl">
             <div className="text-center mb-12 max-w-xl mx-auto">
              <h2 className="text-3xl font-bold">{project.config.targetAudience.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{project.config.targetAudience.description}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.config.benefits.map((benefit: any, index: number) => {
                const Icon = benefitIcons[index % benefitIcons.length] || Clock;
                return (
                  <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                    <Icon className="h-8 w-8 mb-4" style={{ color: project.config.accentColor }} />
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {project.config.faqSections && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <Accordion type="single" collapsible defaultValue="who-is-it-for" className="w-full space-y-4">
              {project.config.faqSections.whoIsItFor?.items?.length > 0 && (
                 <AccordionItem value="who-is-it-for" className="border border-gray-200 dark:border-slate-700 rounded-lg px-6">
                   <AccordionTrigger className="text-lg font-medium">
                      {project.config.faqSections.whoIsItFor.title}
                   </AccordionTrigger>
                   <AccordionContent>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                        {project.config.faqSections.whoIsItFor.items.map((item: string, i: number) => (
                           <li key={i}>{item}</li>
                        ))}
                      </ul>
                   </AccordionContent>
                 </AccordionItem>
              )}
               {project.config.faqSections.whatCanItDo?.items?.length > 0 && (
                 <AccordionItem value="what-can-it-do" className="border border-gray-200 dark:border-slate-700 rounded-lg px-6">
                   <AccordionTrigger className="text-lg font-medium">
                      {project.config.faqSections.whatCanItDo.title}
                   </AccordionTrigger>
                   <AccordionContent>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                        {project.config.faqSections.whatCanItDo.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                   </AccordionContent>
                 </AccordionItem>
              )}
            </Accordion>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="text-center py-8 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400">{project.config.footerText}</p>
      </footer>
    </main>
  );
} 