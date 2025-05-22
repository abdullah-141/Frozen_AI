
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mic, Search, Loader2, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

interface TopicInputFormProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  currentLanguage: "en" | "bn";
  onLanguageChange: (language: "en" | "bn") => void;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function TopicInputForm({ onSearch, isLoading, currentLanguage, onLanguageChange }: TopicInputFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: "",
    },
  });

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const currentRecognition = recognitionRef.current;
    return () => {
      if (currentRecognition) {
        currentRecognition.stop();
        currentRecognition.onresult = null;
        currentRecognition.onerror = null;
        currentRecognition.onstart = null;
        currentRecognition.onend = null;
      }
    };
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onSearch(data.topic);
  }

  const handleVoiceInputClick = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false; 
    recognition.lang = currentLanguage === "bn" ? "bn-BD" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: `Speak now in ${currentLanguage === "bn" ? "Bengali" : "English"}.`,
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        form.setValue("topic", finalTranscript.trim(), { shouldValidate: true });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      let errorMsg = "An error occurred during speech recognition.";
      if (event.error === "no-speech") {
        errorMsg = "No speech was detected. Please try again.";
      } else if (event.error === "audio-capture") {
        errorMsg = "Microphone problem. Ensure it's enabled and working.";
      } else if (event.error === "not-allowed") {
        errorMsg = "Microphone access denied. Please allow access in your browser settings.";
      } else if (event.error === 'language-not-supported') {
        errorMsg = `The language selected (${recognition.lang}) is not supported by your browser's speech recognition. Try English.`;
      }
      toast({
        title: "Voice Input Error",
        description: errorMsg,
        variant: "destructive",
      });
      setIsListening(false); 
    };

    recognition.onend = () => {
      setIsListening(false);
      const currentTopicValue = form.getValues("topic");
      if (currentTopicValue) {
          form.trigger("topic"); 
      }
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      toast({
        title: "Voice Input Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Enter a topic</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Quantum Physics, Machine Learning, Photosynthesis"
                    {...field}
                    className="text-base"
                    disabled={isLoading || isListening}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleVoiceInputClick} 
                    disabled={isLoading} 
                    aria-label={isListening ? "Stop Listening" : "Voice Input"}
                    className={isListening ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
                  >
                    {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full pt-2"> {/* Adjusted for spacing and width */}
            <Label htmlFor="language-select-topic-form" className="text-base mb-2 block">
              <Languages className="inline-block mr-2 h-5 w-5 align-text-bottom" />
              Preferred Language
            </Label>
            <Select
              value={currentLanguage}
              onValueChange={onLanguageChange}
              disabled={isLoading || isListening}
            >
              <SelectTrigger id="language-select-topic-form" className="w-full text-base">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Affects AI explanations, diagrams, concepts, and voice input.
            </p>
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || isListening}>
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? "Clarifying..." : "Clarify Topic"}
        </Button>
      </form>
    </Form>
  );
}
