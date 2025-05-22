
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle, MessageSquareQuote, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HigherSecondaryLevelPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(searchParams.get('name'));
  }, [searchParams]);

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Feature Unavailable",
      description: `${featureName} is coming soon!`,
      variant: "default",
    });
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
           উচ্চ মাধ্যমিক স্তরের শিক্ষা উপকরণ
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          একাদশ ও দ্বাদশ শ্রেণীর জন্য বিশেষভাবে প্রস্তুতকৃত।
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>ইন্টারেক্টিভ শিক্ষা সরঞ্জাম</CardTitle>
          <CardDescription>আপনার পড়াশোনাকে আরও সহজ ও আনন্দময় করতে নিচের অপশনগুলো ব্যবহার করুন।</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="group h-full w-full p-4 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-primary-foreground hover:border-primary"
            onClick={() => handleFeatureClick("বইয়ের সাথে চ্যাট")}
          >
            <MessageSquareQuote className="h-12 w-12 text-primary group-hover:text-primary-foreground mb-2" />
            <span className="text-lg font-semibold">বইয়ের সাথে চ্যাট</span>
            <span className="text-sm text-muted-foreground group-hover:text-primary-foreground">যেকোনো বিষয় সহজে বুঝুন</span>
          </Button>
          <Link href={`/education/higher-secondary/solve-problem?name=${userName || ''}`} passHref className="block h-full">
            <Button
              variant="outline"
              className="group h-full w-full p-4 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <HelpCircle className="h-12 w-12 text-primary group-hover:text-primary-foreground mb-2" />
              <span className="text-lg font-semibold">প্রশ্নোত্তর পর্ব</span>
              <span className="text-sm text-muted-foreground group-hover:text-primary-foreground">সমস্যার ছবি দিন, সমাধান পান</span>
            </Button>
          </Link>
          <Link href={`/education/higher-secondary/quiz?name=${userName || ''}`} passHref className="block h-full">
            <Button
              variant="outline"
              className="group h-full w-full p-4 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <Edit className="h-12 w-12 text-primary group-hover:text-primary-foreground mb-2" />
              <span className="text-lg font-semibold">কুইজ</span>
              <span className="text-sm text-muted-foreground group-hover:text-primary-foreground">জ্ঞান যাচাই করুন</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
