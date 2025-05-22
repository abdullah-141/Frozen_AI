
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, Search, BellRing, Phone, BookOpen, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface Circular {
  id: string;
  title: string;
  universityKeywords: string[]; // For matching search terms
  year: string;
  pdfUrl: string;
  description?: string;
}

const allCirculars: Circular[] = [
  {
    id: 'buet-2024-1',
    title: 'BUET 2024 Admission Circular',
    universityKeywords: ['buet', 'bangladesh university of engineering and technology', 'বুয়েট', 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়'],
    year: '2024',
    pdfUrl: 'https://drive.google.com/file/d/1_trTlQM5On8oTjxN3JCvNA2ptVfxO7UA/view?usp=drive_link',
    description: 'Admission circular for Bangladesh University of Engineering and Technology for the year 2024.'
  },
  // Add more circulars here
];

const universitySuggestions = [
  "Bangladesh University of Engineering and Technology (BUET)",
  "University of Dhaka (DU)",
  "Jahangirnagar University (JU)",
  "Rajshahi University (RU)",
  "Chittagong University (CU)",
  "Khulna University (KU)",
  "Islamic University, Bangladesh (IU)",
  "Shahjalal University of Science and Technology (SUST)",
  "North South University (NSU)",
  "BRAC University (BRACU)",
  "American International University-Bangladesh (AIUB)",
  // Add more universities
];


export default function CircularZonePage() {
  const [targetUniversities, setTargetUniversities] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { toast } = useToast();

  const [hasSearched, setHasSearched] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchedUniversities, setSearchedUniversities] = useState("");

  const [foundCirculars, setFoundCirculars] = useState<Circular[]>([]);

  // Autofill states
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    setAvailableYears(years);
    setSelectedYear(currentYear.toString());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUniversityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetUniversities(value);

    const terms = value.split(',').map(term => term.trim());
    const activeTerm = terms[terms.length - 1].toLowerCase();
    setCurrentSearchTerm(activeTerm);

    if (activeTerm) {
      const filteredSuggestions = universitySuggestions.filter(uni =>
        uni.toLowerCase().includes(activeTerm)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const terms = targetUniversities.split(',').map(term => term.trim());
    terms[terms.length - 1] = suggestion;
    setTargetUniversities(terms.join(', ') + (terms.length > 0 && terms[terms.length-1] !== "" ? ", " : ""));
    setShowSuggestions(false);
    setCurrentSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const handleSearch = () => {
    if (!targetUniversities.trim() && !selectedYear) {
      toast({
        title: "Search Criteria Needed",
        description: "Please enter a university name or select a year.",
        variant: "default"
      });
      return;
    }
    
    setHasSearched(true);
    setShowPhoneInput(false);
    setIsSubscribed(false);
    setPhoneNumber("");
    setSearchedUniversities(targetUniversities);

    // Filter circulars
    const searchKeywords = targetUniversities.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
    const results = allCirculars.filter(circular => {
      const yearMatch = circular.year === selectedYear;
      const universityMatch = searchKeywords.length === 0 || searchKeywords.some(keyword =>
        // Corrected logic: check if the user's input keyword includes any of our predefined university keywords
        circular.universityKeywords.some(uniKeyword => keyword.includes(uniKeyword.toLowerCase()))
      );
      return yearMatch && universityMatch;
    });
    setFoundCirculars(results);

    if (results.length > 0) {
       toast({
        title: "Search Complete",
        description: `${results.length} circular(s) found matching your criteria.`,
      });
    } else {
      toast({
        title: "Search Complete",
        description: `No circulars found for: ${targetUniversities || 'Any University'} for year: ${selectedYear}.`,
      });
    }
  };

  const handleSubscribe = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to subscribe.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Subscribed!",
      description: `You will be notified via ${phoneNumber} when circulars are released.`,
      variant: "default"
    });
    setIsSubscribed(true);
    setShowPhoneInput(false);
  };

  const currentNotificationYear = new Date().getFullYear().toString();

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      return url.replace("/view", "/preview").replace("usp=drive_link", "");
    }
    return url;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          University Admission Circulars
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Find the latest admission circulars from various universities here.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Filter Circulars</CardTitle>
          <CardDescription>
            Enter your target universities and select the circular year.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Label htmlFor="university-input" className="text-base">Target University/Universities</Label>
            <Input
              id="university-input"
              ref={inputRef}
              type="text"
              value={targetUniversities}
              onChange={handleUniversityInputChange}
              onFocus={() => currentSearchTerm && setShowSuggestions(true)}
              placeholder="e.g., Dhaka University, BUET (comma-separated)"
              className="mt-1 text-base"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-muted cursor-pointer text-sm"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="year-select" className="text-base">Circular Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select" className="w-full mt-1 text-base">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year} className="text-base">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSearch} className="w-full text-lg py-6">
            <Search className="mr-2 h-5 w-5" />
            Search Circulars
          </Button>
        </CardFooter>
      </Card>

      {hasSearched && (
        <Card className="w-full max-w-2xl mx-auto shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {foundCirculars.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {foundCirculars.map((circular) => (
                  <AccordionItem value={circular.id} key={circular.id} className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                    <AccordionTrigger className="p-4 hover:bg-muted/50 w-full text-left">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-grow">
                          <h4 className="font-semibold text-base text-foreground">{circular.title}</h4>
                          {circular.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{circular.description}</p>}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0 border-t bg-muted/20">
                      <div className="p-4 space-y-3">
                        <div className="flex justify-end gap-2 mb-2">
                           <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(circular.pdfUrl, '_blank')}
                            title="Open in New Tab"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                          </Button>
                        </div>
                         <p className="text-xs text-muted-foreground">
                           Note: If you encounter issues viewing the document, please use the "Open in New Tab" option.
                        </p>
                        <div className="aspect-[4/5] sm:aspect-video border rounded-md overflow-hidden bg-background">
                          <iframe
                            src={getEmbedUrl(circular.pdfUrl)}
                            width="100%"
                            height="100%"
                            title={circular.title}
                            className="border-0"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          ></iframe>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-md">
                  <p className="text-yellow-700 dark:text-yellow-300 text-center">
                    No circulars found for "{searchedUniversities || 'your criteria'}" for the year {selectedYear}.
                  </p>
                </div>
                
                {!isSubscribed && (
                  <div className="mt-6 p-4 border border-dashed rounded-md bg-muted/20">
                    <p className="mb-3 text-center text-base">
                      Would you like to be notified when the {currentNotificationYear} circular for <strong className="text-primary">{searchedUniversities || 'your selected universities'}</strong> is released?
                    </p>
                    <div className="flex justify-center gap-4 mb-4">
                      <Button onClick={() => { setShowPhoneInput(true); setIsSubscribed(false); }} size="sm">
                        <BellRing className="mr-2 h-4 w-4" /> Yes, Notify Me
                      </Button>
                      <Button variant="outline" onClick={() => setShowPhoneInput(false)} size="sm">
                        No, Thanks
                      </Button>
                    </div>

                    {showPhoneInput && (
                      <div className="space-y-3 p-4 bg-background rounded-md shadow">
                        <div>
                          <Label htmlFor="phone-input" className="text-base font-semibold">Your Phone Number</Label>
                          <div className="flex items-center mt-1">
                            <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                            <Input
                              id="phone-input"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="e.g., 01XXXXXXXXX"
                              className="text-base"
                            />
                          </div>
                        </div>
                        <Button onClick={handleSubscribe} className="w-full">
                          Subscribe for Notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {isSubscribed && (
              <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-md text-center">
                <BellRing className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-300">
                  You will be notified via {phoneNumber} when the circular for {searchedUniversities || 'selected universities'} for {currentNotificationYear} is released.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
