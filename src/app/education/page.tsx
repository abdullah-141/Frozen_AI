
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle, BookMarked, School, Building, Users, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type EducationLevel = "secondary" | "higher-secondary" | "university" | "";
type Department = "eee" | "cse" | "me" | "ce" | "te" | "";
type SecondaryClass = "6" | "7" | "8" | "9" | "10" | "";

export default function EducationLevelSelectionPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("");
  const [selectedClass, setSelectedClass] = useState<SecondaryClass>("");
  const [showDepartmentSelector, setShowDepartmentSelector] = useState(false);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLevelChange = (value: string) => {
    const level = value as EducationLevel;
    setSelectedLevel(level);
    setSelectedDepartment("");
    setSelectedClass("");
    setError(null);

    setShowDepartmentSelector(level === "university");
    setShowClassSelector(level === "secondary");
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value as Department);
    setError(null);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value as SecondaryClass);
    setError(null);
  }

  const handleProceed = () => {
    setError(null);
    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!selectedLevel) {
      setError("Please select an education level.");
      return;
    }

    const queryParams = new URLSearchParams({ name: userName.trim() }).toString();

    if (selectedLevel === "secondary") {
      if (!selectedClass) {
        setError("Please select your class for Secondary level.");
        return;
      }
      router.push(`/education/secondary/${selectedClass}?${queryParams}`);
    } else if (selectedLevel === "higher-secondary") {
      router.push(`/education/higher-secondary?${queryParams}`);
    } else if (selectedLevel === "university") {
      if (!selectedDepartment) {
        setError("Please select a department for university level.");
        return;
      }
      router.push(`/education/university/${selectedDepartment}?${queryParams}`);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <School className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Select Your Education Path</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Tell us your name and choose your academic stage to access tailored resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="user-name" className="text-xl font-semibold mb-2 block flex items-center">
              <User className="h-5 w-5 mr-2" /> Your Name
            </Label>
            <Input
              id="user-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="text-base"
            />
          </div>

          <Separator />

          <div>
            <Label className="text-xl font-semibold mb-3 block">Education Level</Label>
            <RadioGroup value={selectedLevel} onValueChange={handleLevelChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "secondary", label: "Secondary (6-10)", icon: <BookMarked className="h-5 w-5 mr-2" /> },
                { value: "higher-secondary", label: "Higher Secondary (11-12)", icon: <School className="h-5 w-5 mr-2" /> },
                { value: "university", label: "University", icon: <Building className="h-5 w-5 mr-2" /> },
              ].map((level) => (
                <Label
                  key={level.value}
                  htmlFor={`level-${level.value}`}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedLevel === level.value ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem value={level.value} id={`level-${level.value}`} className="sr-only" />
                  {level.icon}
                  <span className="ml-2 text-base font-medium">{level.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {showClassSelector && (
            <div className="pt-4 border-t border-border">
              <Label className="text-xl font-semibold mb-3 block">Select Class (Secondary)</Label>
              <RadioGroup value={selectedClass} onValueChange={handleClassChange} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {["6", "7", "8", "9", "10"].map((classNum) => (
                  <Label
                    key={`class-${classNum}`}
                    htmlFor={`class-${classNum}`}
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedClass === classNum ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={classNum} id={`class-${classNum}`} className="sr-only" />
                    <Users className="h-5 w-5 mr-2 sm:hidden md:inline-block" />
                    <span className="text-base font-medium">Class {classNum}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {showDepartmentSelector && (
            <div className="pt-4 border-t border-border">
              <Label className="text-xl font-semibold mb-3 block">Select Department (University)</Label>
              <RadioGroup value={selectedDepartment} onValueChange={handleDepartmentChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "cse", label: "CSE" },
                  { value: "eee", label: "EEE" },
                  { value: "me", label: "ME (Mechanical)" },
                  { value: "ce", label: "CE (Civil)" },
                  { value: "te", label: "TE (Textile)" },
                ].map((dept) => (
                  <Label
                    key={dept.value}
                    htmlFor={`dept-${dept.value}`}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedDepartment === dept.value ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={dept.value} id={`dept-${dept.value}`} className="sr-only" />
                    <span className="ml-2 text-base font-medium">{dept.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {error && (
            <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md mt-4">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleProceed} size="lg" className="w-full text-lg">
            Proceed
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    