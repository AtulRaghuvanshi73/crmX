"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { queryGemini } from "@/utils/gemini";
import { Badge } from "@/components/ui/badge";

type MessageSuggestion = {
  subject: string;
  body: string;
  tone: string;
  imageType?: string;
};

type MessageSuggestions = {
  objective: string;
  suggestions: MessageSuggestion[];
};

export function MessageSuggestion({ onSelectMessage }: { onSelectMessage?: (message: MessageSuggestion) => void }) {
  const [open, setOpen] = useState(false);
  const [objective, setObjective] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageSuggestions, setMessageSuggestions] = useState<MessageSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const handleGenerateSuggestions = async () => {
    if (!objective.trim()) {
      setError("Please enter a campaign objective");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const result = await queryGemini(`
        Generate message suggestions for the following campaign objective:
        "${objective}"
        
        Return exactly 3 message variations in JSON format with subject line, message body, tone, and suggested image type:
        {
          "objective": "(the original objective)",
          "suggestions": [
            {
              "subject": "(catchy subject line)",
              "body": "(compelling message body)",
              "tone": "(casual/professional/urgent/friendly/etc.)",
              "imageType": "(suggested product or offer image type)"
            },
            {
              "subject": "(different catchy subject line)",
              "body": "(different compelling message body)",
              "tone": "(different tone)",
              "imageType": "(different suggested product or offer image)"
            },
            {
              "subject": "(another catchy subject line)",
              "body": "(another compelling message body)",
              "tone": "(another tone)",
              "imageType": "(another suggested product or offer image)"
            }
          ]
        }
      `);
      
      // Clean the response - remove markdown code block syntax if present
      const cleanedResult = result
        .replace(/^```json\s*/, '') // Remove leading ```json
        .replace(/```\s*$/, '')      // Remove trailing ```
        .trim();
      
      const parsedSuggestions = JSON.parse(cleanedResult) as MessageSuggestions;
      
      setMessageSuggestions(parsedSuggestions);
    } catch (error) {
      console.error("Failed to generate message suggestions:", error);
      setError("Failed to generate message suggestions. Please try again with a different objective.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectMessage = (index: number) => {
    setSelectedMessage(index);
    if (messageSuggestions && onSelectMessage) {
      onSelectMessage(messageSuggestions.suggestions[index]);
    }
  };

  const handleApplySelection = () => {
    if (messageSuggestions && selectedMessage !== null && onSelectMessage) {
      onSelectMessage(messageSuggestions.suggestions[selectedMessage]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          AI Message Suggestions
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Message Suggestions</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <label htmlFor="objective" className="block text-sm font-medium mb-2 text-white">
              Campaign Objective
            </label>
            <div className="flex gap-2">
              <Input
                id="objective"
                placeholder="e.g., Bring back inactive users, promote new summer collection"
                className="w-full text-black"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-black hover:bg-gray-200 hover:text-black"
                onClick={() => {
                  setObjective("");
                  setMessageSuggestions(null);
                  setError(null);
                  setSelectedMessage(null);
                }}
                disabled={!objective.trim()}
              >
                Clear
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Try objectives like "re-engage customers who haven't purchased in 3 months" or "promote holiday sale"
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-sm mb-4">
              {error}
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <p className="mt-2">Generating message suggestions...</p>
            </div>
          )}

          {messageSuggestions && !isProcessing && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Message Suggestions:</h3>
              
              {messageSuggestions.suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    selectedMessage === index 
                    ? "border-blue-500 bg-blue-500 bg-opacity-20" 
                    : "border-gray-600 hover:border-blue-400"
                  }`}
                  onClick={() => handleSelectMessage(index)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{suggestion.subject}</h4>
                    <Badge className="bg-purple-500 bg-opacity-50">{suggestion.tone}</Badge>
                  </div>
                  <p className="text-sm mb-3">{suggestion.body}</p>
                  {suggestion.imageType && (
                    <div className="text-xs text-gray-400">
                      💡 Suggested imagery: <span className="bg-green-500 bg-opacity-30 px-2 py-1 rounded">{suggestion.imageType}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="mr-2 text-black hover:text-black hover:bg-gray-100"
          >
            Cancel
          </Button>
          {!messageSuggestions && (
            <Button 
              disabled={isProcessing || !objective.trim()} 
              onClick={handleGenerateSuggestions}
            >
              Generate Suggestions
            </Button>
          )}
          {messageSuggestions && (
            <Button 
              onClick={handleApplySelection}
              disabled={selectedMessage === null}
              className="bg-green-600 hover:bg-green-700"
            >
              Use Selected Message
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
