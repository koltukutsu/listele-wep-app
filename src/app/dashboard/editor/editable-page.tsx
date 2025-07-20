"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface Feature {
  title: string;
  description: string;
}

interface Config {
  name: string;
  tagline: string;
  description: string;
  features: Feature[];
}

interface EditablePageProps {
  config: Config;
  updateConfig: (path: string, value: any) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}

export default function EditablePage({ config, updateConfig, addFeature, removeFeature }: EditablePageProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Basic Project Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
        <div>
          <Label htmlFor="name">Proje Adı</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            placeholder="Örn: Harika Fikrim"
          />
        </div>
        <div>
          <Label htmlFor="tagline">Ana Başlık</Label>
          <Input
            id="tagline"
            value={config.tagline}
            onChange={(e) => updateConfig('tagline', e.target.value)}
            placeholder="Ana başlık"
          />
        </div>
        <div>
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateConfig('description', e.target.value)}
            placeholder="Proje açıklaması"
            rows={3}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Özellikler</h2>
          <Button onClick={addFeature} size="sm">Ekle</Button>
        </div>
        {config.features.map((feature, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Özellik {index + 1}</span>
              <Button onClick={() => removeFeature(index)} variant="outline" size="sm">Sil</Button>
            </div>
            <Input
              value={feature.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(`features.${index}.title`, e.target.value)}
              placeholder="Özellik başlığı"
            />
            <Textarea
              value={feature.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateConfig(`features.${index}.description`, e.target.value)}
              placeholder="Özellik açıklaması"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 