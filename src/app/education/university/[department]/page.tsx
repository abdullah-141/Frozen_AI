
"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, XCircle, BookOpen, Library } from 'lucide-react'; 
import { useEffect, useState } from 'react';

const departmentMap: { [key: string]: string } = {
  cse: "Computer Science and Engineering",
  eee: "Electrical and Electronic Engineering",
  me: "Mechanical Engineering",
  ce: "Civil Engineering",
  te: "Textile Engineering",
};

interface Paper {
  title: string;
  url:string;
  description?: string;
}

const samplePapersByDepartment: { [key: string]: Paper[] } = {
  cse: [
    { title: "RESEARCH PAPER ON ARTIFICIAL INTELLIGENCE & ITS APPLICATIONS", url: "https://www.ijrti.org/papers/IJRTI2304061.pdf", description: "An overview of AI and its various applications." },
    { title: "Workshop on Advancing Computer Architecture", url: "https://cra.org/ccc/wp-content/uploads/sites/2/2015/06/ACAR2-Report.pdf", description: "Report from a workshop on future directions in computer architecture." },
    { title: "Introduction to Computer Networking", url: "https://www.researchpublish.com/upload/book/Computer%20Networking-318.pdf", description: "A foundational text on computer networking principles." },
  ],
  eee: [
    { title: "A Brief History of the Department of Electrical Engineering University of Michigan", url: "https://ece.engin.umich.edu/wp-content/uploads/sites/4/2019/10/Bailey-History-annotated.pdf", description: "Historical overview of the EE department at the University of Michigan." },
    { title: "A Review on Semiconductors Including Applications and Temperature Effects in Semiconductors", url: "https://core.ac.uk/download/pdf/235049651.pdf", description: "Comprehensive review of semiconductors, their applications, and temperature effects." },
    { title: "Quantum Computing Applications in Electrical Circuit Design and Optimization", url: "https://www.hilarispublisher.com/open-access/quantum-computing-applications-in-electrical-circuit-design-and-optimization.pdf", description: "Exploring the use of quantum computing in electrical circuit design." },
  ],
  me: [
     { title: "Sample Mechanical Engineering Paper", url: "https://drive.google.com/file/d/1m2QJVWBp1da99iU6GH-u0IldYflZuCFR/view?usp=drive_link", description: "Research on thermodynamics or fluid mechanics." },
  ],
  ce: [],
  te: [],
};

export default function UniversityDepartmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [departmentName, setDepartmentName] = useState<string>("University");
  const [currentPapers, setCurrentPapers] = useState<Paper[]>([]);
  const [selectedPaperUrl, setSelectedPaperUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const departmentSlug = typeof params.department === 'string' ? params.department.toLowerCase() : "";

  useEffect(() => {
    setUserName(searchParams.get('name'));
    if (departmentSlug && departmentMap[departmentSlug]) {
      setDepartmentName(departmentMap[departmentSlug]);
      setCurrentPapers(samplePapersByDepartment[departmentSlug] || []);
    } else if (departmentSlug) {
      setDepartmentName(departmentSlug.toUpperCase() + " (Department Not Fully Configured)");
      setCurrentPapers([]);
    }
    setSelectedPaperUrl(null);
  }, [departmentSlug, searchParams]);

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      return url.replace("/view", "/preview").replace("usp=drive_link", "");
    }
    return url;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        {userName && (
          <p className="text-2xl font-semibold text-pink-500 mb-4">
            Welcome, {userName}!
          </p>
        )}
        <h1 className="text-3xl font-bold text-foreground">
          {departmentName} Resources
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore resources for your field.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Library className="h-6 w-6 mr-2 text-primary" />
            Research Materials
          </CardTitle>
          <CardDescription>
            Access research papers and academic articles relevant to {departmentName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentPapers.length > 0 ? (
            <div className="space-y-4">
              {currentPapers.map((paper, index) => (
                <Card key={index} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-muted/30">
                  <div>
                    <h3 className="font-semibold text-lg">{paper.title}</h3>
                    {paper.description && <p className="text-sm text-muted-foreground">{paper.description}</p>}
                  </div>
                  <Button onClick={() => setSelectedPaperUrl(paper.url)} variant="outline" size="sm" className="shrink-0">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Paper
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-6 border border-dashed rounded-md">
              No papers available for this department yet.
            </p>
          )}

          {selectedPaperUrl && (
            <div className="mt-8 p-4 border rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-grow"></div>
                <div className="flex gap-2">
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedPaperUrl, '_blank')}
                    title="Open in New Tab"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setSelectedPaperUrl(null)} title="Close viewer">
                    <XCircle className="mr-2 h-4 w-4" /> Close View
                  </Button>
                </div>
              </div>
               <p className="text-xs text-muted-foreground mb-2">
                 Note: If you encounter issues viewing the document, please use the "Open in New Tab" option.
              </p>
              <div className="aspect-[4/5] sm:aspect-video border rounded-md overflow-hidden">
                <iframe
                  src={getEmbedUrl(selectedPaperUrl)}
                  width="100%"
                  height="100%"
                  title="Paper Viewer"
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
    
