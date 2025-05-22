
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, ExternalLink, XCircle, FlaskConical } from 'lucide-react';

interface LabManual {
  title: string;
  description: string;
  url: string;
}

const labManuals: LabManual[] = [
  {
    title: "Biology Lab Manual",
    description: "Fundamental biology experiments and procedures.",
    url: "https://drive.google.com/file/d/1FK02ERsHjWhPd49Y62baPEGI8WARov5f/view?usp=drive_link",
  },
  {
    title: "Physics Lab Manual",
    description: "Core physics experiments and data analysis techniques.",
    url: "https://drive.google.com/file/d/1ccc2sl5-lEYi5E9AwPise07PCwDmges1/view?usp=drive_link",
  },
  {
    title: "Chemistry Lab Manual",
    description: "Essential chemistry experiments, safety, and lab skills.",
    url: "https://drive.google.com/file/d/1SOokbyKeZ8N1FCKR-OBlPtgilAmxcnT6/view?usp=drive_link",
  },
];

export default function VirtualLabPage() {
  const [selectedManualUrl, setSelectedManualUrl] = useState<string | null>(null);

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      // For GDrive links, try to use the /preview endpoint for better embedding
      return url.replace("/view", "/preview").replace("usp=drive_link", "");
    }
    return url; // For other URLs, use as is
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <FlaskConical className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to the Virtual Lab
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Explore fundamental science lab manuals. Select a manual to view its content.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Available Lab Manuals</CardTitle>
          <CardDescription>Click "View Manual" to read the PDF directly on this page.</CardDescription>
        </CardHeader>
        <CardContent>
          {labManuals.length > 0 ? (
            <div className="space-y-4">
              {labManuals.map((manual, index) => (
                <Card key={index} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-muted/30">
                  <div>
                    <h3 className="font-semibold text-lg">{manual.title}</h3>
                    <p className="text-sm text-muted-foreground">{manual.description}</p>
                  </div>
                  <Button onClick={() => setSelectedManualUrl(manual.url)} variant="outline" size="sm" className="shrink-0">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Manual
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-6 border border-dashed rounded-md">
              No lab manuals available at the moment.
            </p>
          )}

          {selectedManualUrl && (
            <div className="mt-8 p-4 border rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-grow"></div> {/* Pushes buttons to the right */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedManualUrl, '_blank')}
                    title="Open in New Tab"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setSelectedManualUrl(null)} title="Close viewer">
                    <XCircle className="mr-2 h-4 w-4" /> Close View
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Note: If you encounter issues viewing the document, please use the "Open in New Tab" option.
              </p>
              <div className="aspect-[4/5] sm:aspect-video border rounded-md overflow-hidden">
                <iframe
                  src={getEmbedUrl(selectedManualUrl)}
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  className="border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
