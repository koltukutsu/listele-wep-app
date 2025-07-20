"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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

interface PreviewProps {
  config: Config;
}

export default function Preview({ config }: PreviewProps) {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 h-full">
      <div className="max-w-3xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-4xl font-bold">{config.name}</h1>
          <p className="text-xl text-muted-foreground mt-2">{config.tagline}</p>
        </header>
        <main className="space-y-12">
          <div>
            <p className="text-lg text-center">{config.description}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {config.features.map((feature: Feature, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 