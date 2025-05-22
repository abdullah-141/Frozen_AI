
"use client";

import { useEffect, useState, useRef } from 'react';
import { Accessibility, Mic, Loader2, Play, Pause, Square, YoutubeIcon, Headphones, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { generateTopicExplanation, type GenerateTopicExplanationOutput } from '@/ai/flows/generate-topic-explanation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Audiobook {
  id: string;
  title: string;
  title_bn: string;
  description: string;
  description_bn: string;
  url: string;
  icon?: React.ElementType;
  isEmbeddable?: boolean;
}

const sampleAudiobooks: Audiobook[] = [
  {
    id: 'sherlock',
    title: "The Adventures of Sherlock Holmes",
    title_bn: "শার্লক হোমসের অভিযান",
    description: "Classic detective stories by Arthur Conan Doyle.",
    description_bn: "আর্থার কোনান ডয়েলের ক্লাসিক গোয়েন্দা গল্প।",
    url: "https://drive.google.com/uc?export=download&id=1-24wdjwVmntHDZ_fcTXDNxENmBPi6zUx",
    icon: BookOpen,
    isEmbeddable: true,
  },
  {
    id: 'pride',
    title: "Pride and Prejudice",
    title_bn: "প্রাইড অ্যান্ড প্রেজুডিস",
    description: "A beloved romance novel by Jane Austen.",
    description_bn: "জেন অস্টিনের একটি জনপ্রিয় রোমান্টিক উপন্যাস।",
    url: "https://www.gutenberg.org/ebooks/1342",
    icon: BookOpen,
  },
  {
    id: 'frankenstein',
    title: "Frankenstein",
    title_bn: "ফ্রাঙ্কেনস্টাইন",
    description: "Mary Shelley's groundbreaking gothic novel.",
    description_bn: "মেরি শেলির যুগান্তকারী গথিক উপন্যাস।",
    url: "https://www.gutenberg.org/ebooks/84",
    icon: BookOpen,
  }
];


export default function SpecialPage() {
  const { toast } = useToast();
  const [userQuery, setUserQuery] = useState<string>("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisPaused, setSpeechSynthesisPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [showPlayerForBookId, setShowPlayerForBookId] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    setIsMounted(true);
    // Stop any ongoing speech synthesis when component unmounts or language changes
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
       if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = ''; // Detach source
      }
    };
  }, []);

  // Effect for initial welcome TTS - separate from AI response TTS
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && window.speechSynthesis) {
      if (!aiExplanation && !isSpeaking && !userQuery) { // Only play if no other TTS/AI process is active
        const introMessage = language === "en"
          ? "Welcome to the Special's voice search. Please click the microphone button and say your query."
          : "স্পেশাল ভয়েস সার্চে স্বাগতম। অনুগ্রহ করে মাইক্রোফোন বাটনে ক্লিক করুন এবং আপনার প্রশ্ন বলুন।";
        
        window.speechSynthesis.cancel();
        const introUtterance = new SpeechSynthesisUtterance(introMessage);
        introUtterance.lang = language === "en" ? 'en-US' : 'bn-BD';
        
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.lang === introUtterance.lang && voice.name.includes('Female'));
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === introUtterance.lang);
        }
        if (selectedVoice) {
            introUtterance.voice = selectedVoice;
        }

        // Delay slightly to ensure page is ready and avoid conflicts
        const playIntro = setTimeout(() => {
          if (!isSpeaking && !aiExplanation) { // Double check before playing
            window.speechSynthesis.speak(introUtterance);
          }
        }, 500);
        return () => clearTimeout(playIntro);
      }
    }
  }, [language, isMounted, aiExplanation, isSpeaking, userQuery]);


  const speakText = (text: string, langToSpeak: string) => {
    if (!isMounted || typeof window === 'undefined' || !window.speechSynthesis) {
      toast({ title: language === "en" ? "Text-to-Speech not available" : "টেক্সট-টু-স্পীচ উপলব্ধ নয়", description: language === "en" ? "Your browser does not support speech synthesis." : "আপনার ব্রাউজার স্পীচ সিন্থেসিস সমর্থন করে না।", variant: "destructive" });
      return;
    }

    window.speechSynthesis.cancel(); 

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    const utterance = utteranceRef.current;
    utterance.lang = langToSpeak;
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.lang === langToSpeak && voice.name.includes('Female')) || voices.find(voice => voice.lang === langToSpeak);
    
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(langToSpeak.substring(0,2)));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(`No specific voice found for lang ${langToSpeak}. Using browser default.`);
      const noVoiceMessage = language === 'en'
        ? `No specific voice for "${langToSpeak}" or general ${langToSpeak.startsWith('en') ? 'English ("en")' : 'Bengali ("bn")'} was found in your browser. The browser will attempt to use a default voice, but playback may not occur or might be in a different language.`
        : `আপনার ব্রাউজারে "${langToSpeak}" বা সাধারণ ${langToSpeak.startsWith('en') ? 'ইংরেজি ("en")' : 'বাংলা ("bn")'} এর জন্য কোনো বিশেষ কণ্ঠস্বর খুঁজে পাওয়া যায়নি। ব্রাউজার একটি ডিফল্ট ভয়েস ব্যবহার করার চেষ্টা করবে, তবে প্লেব্যাক নাও হতে পারে অথবা অন্য ভাষায় হতে পারে।`;
      toast({
        title: language === "en" ? "Voice Not Found" : "কণ্ঠস্বর পাওয়া যায়নি",
        description: noVoiceMessage,
        variant: "default",
      });
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechSynthesisPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechSynthesisPaused(false);
    };
    utterance.onpause = () => setSpeechSynthesisPaused(true);
    utterance.onresume = () => setSpeechSynthesisPaused(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error", event);
      toast({ title: language === "en" ? "Speech Error" : "স্পীচ ত্রুটি", description: `${language === "en" ? "Could not speak the text: " : "টেক্সট বলা যায়নি: "}${event.error}`, variant: "destructive" });
      setIsSpeaking(false);
      setSpeechSynthesisPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort(); 
    }
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any ongoing TTS
    }
    setIsSpeaking(false);
    setSpeechSynthesisPaused(false);
    
    const SpeechRecognitionAPI = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognitionAPI) {
      toast({ title: language === "en" ? "Voice Input Not Supported" : "ভয়েস ইনপুট সমর্থিত নয়", description: language === "en" ? "Your browser does not support voice recognition." : "আপনার ব্রাউজার ভয়েস রিকগনিশন সমর্থন করে না।", variant: "destructive" });
      return;
    }

    setUserQuery("");
    setAiExplanation(null);
    setError(null);
    
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false; 
    recognition.lang = language === "en" ? 'en-US' : 'bn-BD';

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: language === "en" ? "Listening..." : "শুনছি...", description: language === "en" ? "Please say your search query." : "অনুগ্রহ করে আপনার প্রশ্ন বলুন।", variant: "default" });
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      setUserQuery(transcript);
      setIsListening(false); 
      if (transcript) {
        await fetchExplanation(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      let errorMsgKey = "speechRecognitionError";
      if (event.error === "no-speech") errorMsgKey = "noSpeechDetected";
      else if (event.error === "audio-capture") errorMsgKey = "microphoneProblem";
      else if (event.error === "not-allowed") errorMsgKey = "microphoneAccessDenied";
      else if (event.error === "network") errorMsgKey = "networkErrorSpeech";

      const errorMessages = {
        en: {
          speechRecognitionError: "An error occurred during speech recognition.",
          noSpeechDetected: "No speech was detected. Please try again.",
          microphoneProblem: "Microphone problem. Ensure it's enabled and working.",
          microphoneAccessDenied: "Microphone access denied. Please allow access.",
          networkErrorSpeech: "Network error during speech recognition. Please check your internet connection.",
        },
        bn: {
          speechRecognitionError: "স্পীচ রিকগনিশনে একটি ত্রুটি ঘটেছে।",
          noSpeechDetected: "কোনো স্পীচ সনাক্ত করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
          microphoneProblem: "মাইক্রোফোনে সমস্যা। এটি সক্রিয় এবং সঠিকভাবে কাজ করছে কিনা তা নিশ্চিত করুন।",
          microphoneAccessDenied: "মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে অনুমতি দিন।",
          networkErrorSpeech: "স্পীচ রিকগনিশনের সময় নেটওয়ার্ক ত্রুটি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।",
        }
      };
      const finalErrorMsg = errorMessages[language][errorMsgKey] || errorMessages[language].speechRecognitionError;
      setError(finalErrorMsg);
      toast({ title: language === "en" ? "Voice Input Error" : "ভয়েস ইনপুট ত্রুটি", description: finalErrorMsg, variant: "destructive" });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false); 
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      toast({ title: language === "en" ? "Voice Input Error" : "ভয়েস ইনপুট ত্রুটি", description: language === "en" ? "Could not start voice recognition." : "ভয়েস রিকগনিশন শুরু করা যায়নি।", variant: "destructive" });
      setIsListening(false);
    }
  };

  const fetchExplanation = async (query: string) => {
    if (!query.trim()) return;
    setIsLoadingAI(true);
    setAiExplanation(null);
    setError(null);

    try {
      const result = await generateTopicExplanation({ topic: query, language });
      const explanation = (result as GenerateTopicExplanationOutput).explanation;
      setAiExplanation(explanation);
      if (explanation) {
        if(speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = setTimeout(() => speakText(explanation, language === 'en' ? 'en-US' : 'bn-BD'), 500);
      }
    } catch (e: any)
     {
      console.error("Error fetching explanation:", e);
      const errorMsg = `${language === "en" ? "Failed to get explanation: " : "ব্যাখ্যা পেতে ব্যর্থ: "}${e.message || (language === "en" ? "Please try again." : "অনুগ্রহ করে আবার চেষ্টা করুন।")}`;
      setError(errorMsg);
      toast({ title: language === "en" ? "AI Error" : "এআই ত্রুটি", description: errorMsg, variant: "destructive" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!isMounted || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (isSpeaking) {
      if (speechSynthesisPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    } else if (aiExplanation) { // If not speaking, but there's an explanation, play it
      speakText(aiExplanation, language === 'en' ? 'en-US' : 'bn-BD');
    }
  };

  const handleStopSpeech = () => {
    if (!isMounted || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeechSynthesisPaused(false);
  };

  const handleAudiobookPlay = (bookId: string) => {
    if (showPlayerForBookId === bookId) {
      setShowPlayerForBookId(null); 
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = ''; 
      }
    } else {
      if (audioPlayerRef.current && showPlayerForBookId !== null) {
         audioPlayerRef.current.pause();
         audioPlayerRef.current.src = '';
      }
      setShowPlayerForBookId(bookId);
    }
  };


  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center">
        <Accessibility className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Specials 🙌
        </h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Mic className="mr-3 h-8 w-8 text-primary" />
            {language === "en" ? "Voice Search" : "ভয়েস সার্চ"}
          </CardTitle>
           <CardDescription>
            {language === "en"
              ? "Select your language, then click the microphone and say your query."
              : "আপনার ভাষা নির্বাচন করুন, তারপর মাইক্রোফোন বাটনে ক্লিক করুন এবং আপনার প্রশ্ন বলুন।"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="w-full max-w-xs">
            <Label htmlFor="language-select-special" className="mb-1 block text-sm font-medium text-muted-foreground">
              {language === "en" ? "Language for Search & Reply" : "অনুসন্ধান ও উত্তরের জন্য ভাষা"}
            </Label>
            <Select value={language} onValueChange={(value: "en" | "bn") => setLanguage(value)} disabled={isLoadingAI || isListening || isSpeaking}>
              <SelectTrigger id="language-select-special">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`h-24 w-24 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${isListening ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse ring-4 ring-destructive/50' : 'bg-card hover:bg-muted ring-2 ring-primary/30 hover:ring-primary'}`}
            onClick={handleToggleListening}
            aria-label={isListening ? (language === "en" ? "Stop Listening" : "শোনা বন্ধ করুন") : (language === "en" ? "Start Voice Search" : "ভয়েস সার্চ শুরু করুন")}
            disabled={isLoadingAI || isSpeaking}
          >
            {isListening ? (
              <Loader2 className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12 text-primary" />
            )}
          </Button>

          {userQuery && (
            <div className="mt-4 p-3 border rounded-md bg-muted w-full text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {language === "en" ? "Your query:" : "আপনার প্রশ্ন:"}
              </p>
              <p className="text-lg font-semibold text-foreground">{userQuery}</p>
            </div>
          )}

          {isLoadingAI && (
            <div className="mt-4 flex flex-col items-center space-y-2 text-primary">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p>{language === "en" ? "Fetching explanation..." : "ব্যাখ্যা আনা হচ্ছে..."}</p>
            </div>
          )}

          {error && !isLoadingAI && (
            <div className="mt-4 p-3 border rounded-md bg-destructive/10 text-destructive w-full text-center">
              <p className="font-semibold">{language === "en" ? "Error:" : "ত্রুটি:"}</p>
              <p>{error}</p>
            </div>
          )}

          {aiExplanation && !isLoadingAI && (
            <Card className="w-full mt-6 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">{language === "en" ? "AI's Explanation:" : "এআই এর ব্যাখ্যা:"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base whitespace-pre-wrap leading-relaxed">{aiExplanation}</p>
                <div className="flex justify-center space-x-3 pt-2">
                  <Button onClick={handleToggleSpeech} variant="outline" size="sm" disabled={!aiExplanation}>
                    {isSpeaking && !speechSynthesisPaused ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isSpeaking && !speechSynthesisPaused ? (language === "en" ? 'Pause' : 'বিরতি') : (language === "en" ? 'Play' : 'শুরু করুন')}
                  </Button>
                  <Button onClick={handleStopSpeech} variant="destructive" size="sm" disabled={!aiExplanation || !isSpeaking}>
                    <Square className="mr-2 h-4 w-4" /> {language === "en" ? 'Stop' : 'বন্ধ করুন'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <YoutubeIcon className="mr-3 h-8 w-8 text-primary" />
            {language === "en" ? "Learn Sign Language" : "ইশারা ভাষা শিখুন"}
          </CardTitle>
          <CardDescription>
            {language === "en" ? "Click to watch a beginner's guide to American Sign Language (ASL)." : "আমেরিকান সাইন ল্যাঙ্গুয়েজ (ASL) শিখতে ভিডিওটি দেখুন।"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sign-language-video">
              <AccordionTrigger className="text-lg hover:no-underline">
                {language === "en" ? "Watch: Learn 25 Basic Signs (ASL)" : "দেখুন: ২৫টি প্রাথমিক ইশারা শিখুন (ASL)"}
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/0FcwzMq4iWg?si=YwUBbVj8_xY0RB1P"
                    title="YouTube video player - Learn 25 Basic Signs"
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

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Headphones className="mr-3 h-8 w-8 text-primary" />
            {language === "en" ? "Audiobooks for You" : "আপনার জন্য অডিওবুক"}
          </CardTitle>
          <CardDescription>
            {language === "en" ? "Explore a selection of audiobooks." : "কিছু অডিওবুক অন্বেষণ করুন।"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleAudiobooks.map((book) => (
            <Card key={book.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/30">
              <div className="flex-grow">
                <h4 className="font-semibold text-lg flex items-center">
                  {book.icon && <book.icon className="mr-2 h-5 w-5 text-primary" />}
                  {language === 'bn' ? book.title_bn : book.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'bn' ? book.description_bn : book.description}
                </p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {book.isEmbeddable ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleAudiobookPlay(book.id)}
                    >
                      <Headphones className="mr-2 h-4 w-4" />
                      {showPlayerForBookId === book.id 
                        ? (language === "en" ? "Hide Player" : "প্লেয়ার লুকান")
                        : (language === "en" ? "Listen Here" : "এখানে শুনুন")
                      }
                    </Button>
                    {showPlayerForBookId === book.id && (
                      <audio 
                        ref={audioPlayerRef}
                        controls 
                        src={book.url} 
                        className="mt-2 w-full rounded-md"
                        onEnded={() => setShowPlayerForBookId(null)}
                        onError={(e) => {
                          console.error("Audio player error:", e);
                          toast({
                            title: language === "en" ? "Audio Playback Error" : "অডিও প্লেব্যাক ত্রুটি",
                            description: language === "en" ? `Could not play ${book.title}. The audio source might be unavailable or in an unsupported format.` : `${book.title_bn} প্লে করা যায়নি। অডিও সোর্স अनुपलब्ध হতে পারে অথবা অসমর্থিত ফরম্যাটে থাকতে পারে।`,
                            variant: "destructive",
                          });
                          setShowPlayerForBookId(null); // Hide player on error
                        }}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </>
                ) : (
                  <a href={book.url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {language === "en" ? "Listen on Gutenberg" : "গুটেনবার্গে শুনুন"}
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
