
"use client";

import { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
// html2canvas is no longer directly used for download, but mermaid.render might still use parts of it or similar browser APIs.
// For now, we keep it in package.json as it might be re-introduced or used by mermaid internals.
// import html2canvas from 'html2canvas'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { generateMermaidHtml, type GenerateMermaidHtmlOutput } from '@/ai/flows/generate-mermaid-html';

interface MermaidDiagramDisplayProps {
  diagramCode: string | null;
  isLoading: boolean;
}

export function MermaidDiagramDisplay({ diagramCode, isLoading: isLoadingProp }: MermaidDiagramDisplayProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isProcessingDownload, setIsProcessingDownload] = useState(false); // Renamed from isDownloading
  const [error, setError] = useState<string | null>(null);
  const diagramId = useId(); 

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral', 
    });
  }, []);

  useEffect(() => {
    if (diagramCode && mermaidRef.current) {
      setIsRendering(true);
      setError(null);
      const codeToRender = diagramCode.trim();
      mermaidRef.current.innerHTML = ''; 
      const uniqueDiagramId = `mermaid-${diagramId}-${Date.now()}`;

      mermaid.render(uniqueDiagramId, codeToRender)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
            const svgElement = mermaidRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%'; 
              svgElement.style.height = 'auto'; 
            }
          }
          setIsRendering(false);
        })
        .catch((e) => {
          console.error("Mermaid rendering error:", e);
          setError("Failed to render diagram. The diagram code might be invalid or too complex. Please ensure the AI generated valid Mermaid syntax.");
          setIsRendering(false);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = ''; 
          }
        });
    } else {
      setIsRendering(false);
      setError(null);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = ''; 
      }
    }
  }, [diagramCode, diagramId]);

  const handleDownloadHtml = async () => {
    if (!diagramCode) {
      setError("Cannot download: Diagram code is not available.");
      return;
    }
  
    setIsProcessingDownload(true);
    setError(null);
  
    try {
      const result = await generateMermaidHtml({ mermaidCode: diagramCode });
      const htmlContent = (result as GenerateMermaidHtmlOutput).htmlContent;
  
      if (!htmlContent || htmlContent.trim() === "") {
        throw new Error("Received empty HTML content from the AI. The AI might have failed to generate the HTML page.");
      }
  
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'diagram.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the object URL
  
    } catch (e: any) {
      console.error("HTML Generation/Download Error:", e);
      let errorMessage = `Failed to generate or download HTML: ${e.message || "Unknown error."}`;
      if (e.message && e.message.includes("empty HTML content")) {
        errorMessage = "Failed to download: The AI service did not return valid HTML for the diagram. Please try again."
      }
      setError(errorMessage);
    } finally {
      setIsProcessingDownload(false);
    }
  };

  if (isLoadingProp) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Visual Diagram</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 mt-2 text-muted-foreground">Generating diagram...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diagramCode && !isRendering && !error) {
    return null; 
  }
  
  const canDownload = diagramCode && !error && !isRendering && !isLoadingProp;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-x-2">
        <CardTitle>Visual Diagram</CardTitle>
        {canDownload && (
          <Button onClick={handleDownloadHtml} disabled={isProcessingDownload} variant="outline" size="sm">
            {isProcessingDownload ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download HTML
          </Button>
        )}
      </CardHeader>
      <CardContent className="min-h-[200px] p-4">
        {isRendering && !isLoadingProp && (
           <div className="flex items-center justify-center h-60">
             <div className="flex flex-col items-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="ml-2 mt-2 text-muted-foreground">Rendering diagram...</p>
             </div>
           </div>
        )}
        {error && <p className="text-destructive p-4 text-center">{error}</p>}
        <div 
          ref={mermaidRef} 
          className={`mermaid-container w-full ${error || isRendering ? 'hidden' : ''} overflow-x-auto bg-card rounded-md p-2`}
        >
          {/* Mermaid SVG will be injected here */}
        </div>
        {!diagramCode && !isRendering && !isLoadingProp && !error && (
             <p className="text-muted-foreground text-center p-4">No diagram generated for this topic yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
