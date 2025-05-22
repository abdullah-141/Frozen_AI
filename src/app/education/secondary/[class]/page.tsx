
"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, HelpCircle, MessageSquareQuote, Edit, Users, ExternalLink, XCircle, YoutubeIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

const classMap: { [key: string]: string } = {
  "6": "ষষ্ঠ শ্রেণী",
  "7": "সপ্তম শ্রেণী",
  "8": "অষ্টম শ্রেণী",
  "9": "নবম শ্রেণী",
  "10": "দশম শ্রেণী",
};

interface Book {
  title: string;
  url: string;
  description?: string;
}

const booksByClass: { [key: string]: Book[] } = {
  '7': [
    { title: "বিজ্ঞান (সপ্তম শ্রেণী)", url: "https://drive.google.com/file/d/1lb7bQEzhSLG0hZZ9y14GCmhcmxjWpa15/view?usp=drive_link", description: "Class 7 Science textbook." },
    { title: "তথ্য ও যোগাযোগ প্রযুক্তি (সপ্তম শ্রেণী)", url: "https://drive.google.com/file/d/1LCG5mQF2hEwCMKXeZDsPCKjbSdaxzlql/view?usp=drive_link", description: "Class 7 ICT textbook." },
  ],
  '9': [
    { title: "গণিত (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/1IuuYwHXUpTGHOpumKq-x6Th4h2xf1b9s/view?usp=drive_link", description: "Class 9-10 Mathematics textbook." },
    { title: "তথ্য ও যোগাযোগ প্রযুক্তি (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/10DYq8yuMb3tgWgTZ7fXx_KThABOUJR6k/view?usp=drive_link", description: "Class 9-10 ICT textbook." },
    { title: "পদার্থবিজ্ঞান (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/121GCSD2909n-ETowJfdtzqOoVcdAe9Fx/view?usp=drive_link", description: "Class 9-10 Physics textbook." },
  ],
  '10': [
    { title: "গণিত (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/1IuuYwHXUpTGHOpumKq-x6Th4h2xf1b9s/view?usp=drive_link", description: "Class 9-10 Mathematics textbook." },
    { title: "তথ্য ও যোগাযোগ প্রযুক্তি (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/10DYq8yuMb3tgWgTZ7fXx_KThABOUJR6k/view?usp=drive_link", description: "Class 9-10 ICT textbook." },
    { title: "পদার্থবিজ্ঞান (নবম-দশম শ্রেণী)", url: "https://drive.google.com/file/d/121GCSD2909n-ETowJfdtzqOoVcdAe9Fx/view?usp=drive_link", description: "Class 9-10 Physics textbook." },
  ],
  '6': [],
  '8': [],
};

export default function SecondaryClassPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const classNumber = typeof params.class === 'string' ? params.class : "";
  const classNameDisplay = classMap[classNumber] || `Secondary Level (Class ${classNumber})`;
  const [userName, setUserName] = useState<string | null>(null);

  const [selectedBookUrl, setSelectedBookUrl] = useState<string | null>(null);
  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);

  useEffect(() => {
    setUserName(searchParams.get('name'));
  }, [searchParams]);

  useEffect(() => {
    let booksForClass: Book[] = booksByClass[classNumber] || [];
    setCurrentBooks(booksForClass);
    setSelectedBookUrl(null);
  }, [classNumber]);

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Feature Unavailable",
      description: `${featureName} for ${classNameDisplay} is coming soon!`,
      variant: "default",
    });
  };

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
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <Users className="h-8 w-8 mr-3 text-primary" />
          {classNameDisplay} শিক্ষা উপকরণ
        </h1>
        
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>আপনার পাঠ্যবইসমূহ</CardTitle>
          <CardDescription>নিচের তালিকা থেকে বই নির্বাচন করে পড়ুন।</CardDescription>
        </CardHeader>
        <CardContent>
          {currentBooks.length > 0 ? (
            <div className="space-y-4">
              {currentBooks.map((book, index) => (
                <Card key={index} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-muted/30">
                  <div>
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    {book.description && <p className="text-sm text-muted-foreground">{book.description}</p>}
                  </div>
                  <Button onClick={() => setSelectedBookUrl(book.url)} variant="outline" size="sm" className="shrink-0">
                    <BookOpen className="mr-2 h-4 w-4" />
                    বই দেখুন
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-6 border border-dashed rounded-md">
              এই শ্রেণীর জন্য কোনো বই এখনও যোগ করা হয়নি।
            </p>
          )}

          {selectedBookUrl && (
            <div className="mt-8 p-4 border rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-grow"></div>
                <div className="flex gap-2">
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedBookUrl, '_blank')}
                    title="Open in new tab"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> নতুন ট্যাবে খুলুন
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setSelectedBookUrl(null)} title="Close viewer">
                    <XCircle className="mr-2 h-4 w-4" /> বন্ধ করুন
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                দ্রষ্টব্য: বই দেখতে সমস্যা হলে, "নতুন ট্যাবে খুলুন" অপশনটি ব্যবহার করুন।
              </p>
              <div className="aspect-[4/5] sm:aspect-video border rounded-md overflow-hidden">
                <iframe
                  src={getEmbedUrl(selectedBookUrl)}
                  width="100%"
                  height="100%"
                  title="Book Viewer"
                  className="border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {classNumber === "6" && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="hover:no-underline p-4">
                  <CardHeader className="p-0 flex-grow text-left">
                    <CardTitle className="flex items-center text-xl">
                      <YoutubeIcon className="mr-2 h-6 w-6 text-destructive" />
                      Class 6 Video Playlist
                    </CardTitle>
                    <CardDescription>ষষ্ঠ শ্রেণীর জন্য সহায়ক ভিডিও প্লেলিস্ট। (দেখতে ক্লিক করুন)</CardDescription>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-md">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/videoseries?si=p8aDzm9JbBuRZLuc&amp;controls=0&amp;list=PLuaHF6yUT-71rJL3BS7SSL-m6b1oI_g-x" 
                      title="YouTube video player - Class 6" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {classNumber === "7" && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="hover:no-underline p-4">
                  <CardHeader className="p-0 flex-grow text-left">
                    <CardTitle className="flex items-center text-xl">
                      <YoutubeIcon className="mr-2 h-6 w-6 text-destructive" />
                      Class 7 Video Playlist
                    </CardTitle>
                    <CardDescription>সপ্তম শ্রেণীর জন্য সহায়ক ভিডিও প্লেলিস্ট। (দেখতে ক্লিক করুন)</CardDescription>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-md">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/videoseries?si=Nn76qC-wkiGv7tRG&amp;list=PLuaHF6yUT-723GFyU8AzQIU65pzItiXI4" 
                      title="YouTube video player - Class 7" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {classNumber === "9" && (
         <Card className="shadow-lg">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="hover:no-underline p-4">
                  <CardHeader className="p-0 flex-grow text-left">
                    <CardTitle className="flex items-center text-xl">
                      <YoutubeIcon className="mr-2 h-6 w-6 text-destructive" />
                      Class 9 Video Playlist
                    </CardTitle>
                    <CardDescription>নবম শ্রেণীর জন্য সহায়ক ভিডিও প্লেলিস্ট। (দেখতে ক্লিক করুন)</CardDescription>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-md">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/videoseries?si=_ZBpvc0JXS7jPrXM&amp;list=PLuaHF6yUT-71qIiT9Zvnou-MDvQp4LVmo" 
                      title="YouTube video player - Class 9" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

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
          <Link href={`/education/secondary/solve-problem?name=${userName || ''}`} passHref className="block h-full">
            <Button
              variant="outline"
              className="group h-full w-full p-4 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <HelpCircle className="h-12 w-12 text-primary group-hover:text-primary-foreground mb-2" />
              <span className="text-lg font-semibold">প্রশ্নোত্তর পর্ব</span>
              <span className="text-sm text-muted-foreground group-hover:text-primary-foreground">সমস্যার ছবি দিন, সমাধান পান</span>
            </Button>
          </Link>
          <Link href={`/education/secondary/quiz?name=${userName || ''}`} passHref className="block h-full">
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
