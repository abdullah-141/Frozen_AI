
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Camera, UploadCloud } from "lucide-react";
import { solveImageProblem, type SolveImageProblemInput, type SolveImageProblemOutput } from "@/ai/flows/solve-image-problem-flow";
import { useToast } from "@/hooks/use-toast";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function HigherSecondarySolveProblemPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "ফাইল খুব বড়",
          description: "অনুগ্রহ করে ৪MB এর ছোট একটি ছবির ফাইল আপলোড করুন।",
          variant: "destructive",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSolution(null); 
      setError(null); 
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "কোনো ফাইল নির্বাচন করা হয়নি",
        description: "অনুগ্রহ করে প্রথমে একটি সমস্যার ছবি আপলোড করুন।",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const photoDataUri = await fileToDataUri(selectedFile);
      const input: SolveImageProblemInput = {
        photoDataUri,
        studentLevel: "Higher Secondary",
      };
      const result = await solveImageProblem(input);
      setSolution((result as SolveImageProblemOutput).solutionText);
    } catch (e: any) {
      console.error("Error solving problem:", e);
      setError(`সমাধান তৈরি করতে সমস্যা হয়েছে: ${e.message || "অনুগ্রহ করে আবার চেষ্টা করুন।"}`);
      setSolution(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <Camera className="mr-3 h-8 w-8 text-primary" />
          উচ্চ মাধ্যমিক স্তরের প্রশ্নোত্তর পর্ব
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          আপনার গণিত, পদার্থবিজ্ঞান, রসায়ন বা অন্যান্য বিষয়ের জটিল সমস্যার ছবি আপলোড করুন এবং বাংলায় ধাপে ধাপে সমাধান পান।
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your Problem Image</CardTitle>
          <CardDescription>সমস্যার একটি স্পষ্ট ছবি নির্বাচন করুন (সর্বোচ্চ ৪MB)।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="problem-image-upload" className="text-base">সমস্যার ছবি</Label>
            <Input
              id="problem-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="text-base"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP etc.</p>
          </div>

          {previewUrl && (
            <div className="mt-4 p-4 border border-dashed rounded-md flex flex-col items-center bg-muted/20">
              <p className="text-sm font-medium mb-2 text-foreground">নির্বাচিত ছবির প্রিভিউ:</p>
              <Image
                src={previewUrl}
                alt="Problem preview"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-[300px] shadow-md"
                data-ai-hint="problem image"
              />
            </div>
          )}
          
          {error && (
             <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>ত্রুটি</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} className="w-full text-lg py-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                সমাধান তৈরি করা হচ্ছে...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" />
                সমাধান পান
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {solution && !isLoading && (
        <Card className="w-full max-w-xl mx-auto shadow-lg mt-8">
          <CardHeader>
            <CardTitle>AI কর্তৃক প্রদত্ত সমাধান:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {solution}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
