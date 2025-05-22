
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, Search, BellRing, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CircularHubPage() {
  const [targetUniversities, setTargetUniversities] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { toast } = useToast();

  const [hasSearched, setHasSearched] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchedUniversities, setSearchedUniversities] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    setAvailableYears(years);
    setSelectedYear(currentYear.toString());
  }, []);

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
    setShowPhoneInput(false); // Reset phone input visibility on new search
    setIsSubscribed(false); // Reset subscription status on new search
    setPhoneNumber(""); // Reset phone number on new search
    setSearchedUniversities(targetUniversities); // Store searched universities for notification message

    toast({
      title: "Search Initiated",
      description: `Searching for circulars from: ${targetUniversities || 'Any University'} for year: ${selectedYear}. (Simulating no results found to show notification flow).`,
    });
    // In a real app, here you would fetch circulars.
    // For now, we directly proceed to "no results" and notification flow.
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
    // Basic phone number validation (e.g., length, digits only) could be added here.
    // For simplicity, we'll just check if it's not empty.

    toast({
      title: "Subscribed!",
      description: `You will be notified via ${phoneNumber} when circulars are released.`,
      variant: "default" // Changed to default for success
    });
    setIsSubscribed(true);
    setShowPhoneInput(false); // Hide phone input after subscription
  };

  const currentNotificationYear = new Date().getFullYear().toString();

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
          <div>
            <Label htmlFor="university-input" className="text-base">Target University/Universities</Label>
            <Input
              id="university-input"
              type="text"
              value={targetUniversities}
              onChange={(e) => setTargetUniversities(e.target.value)}
              placeholder="e.g., Dhaka University, BUET (comma-separated)"
              className="mt-1 text-base"
            />
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
            {isSubscribed ? (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-md text-center">
                <BellRing className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-300">
                  You will be notified via {phoneNumber} when the circular for {searchedUniversities || 'selected universities'} for {currentNotificationYear} is released.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-md">
                  <p className="text-yellow-700 dark:text-yellow-300 text-center">
                    No circulars found for "{searchedUniversities || 'your criteria'}" for the year {selectedYear}.
                  </p>
                </div>
                
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
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
