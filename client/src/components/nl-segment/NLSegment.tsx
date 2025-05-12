"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { queryGemini } from "@/utils/gemini";

type Rule = {
  field: string;
  operator: string;
  value: number | string;
  humanReadable: string;
};

type SegmentRules = {
  description: string;
  rules: Rule[];
};

export function NLSegment({ onApplyRules }: { onApplyRules?: (rules: Rule[]) => void }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [segmentRules, setSegmentRules] = useState<SegmentRules | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedRules, setAppliedRules] = useState<boolean>(false);
  const handleGenerateRules = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your segment");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const result = await queryGemini(prompt);
      
      // Clean the response - remove markdown code block syntax if present
      const cleanedResult = result
        .replace(/^```json\s*/, '') // Remove leading ```json
        .replace(/```\s*$/, '')      // Remove trailing ```
        .trim();
      
      const parsedRules = JSON.parse(cleanedResult) as SegmentRules;
      
      setSegmentRules(parsedRules);
    } catch (error) {
      console.error("Failed to generate segment rules:", error);
      setError("Failed to generate segment rules. Please try again with a different description.");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleApplyRules = () => {
    if (segmentRules && onApplyRules) {
      onApplyRules(segmentRules.rules);
      setAppliedRules(true);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Natural Language Segment
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="sm:max-w-[500px]"
        onOpenAutoFocus={(e) => {
          // Clear the segment rules when the dialog is opened if applicable
          if (segmentRules && onApplyRules) {
            onApplyRules(segmentRules.rules);
          }
        }}
        onEscapeKeyDown={() => {
          // If dialog is closed with Escape key and there are unsaved changes
          if (segmentRules && !appliedRules && onApplyRules) {
            onApplyRules([]); // Reset filters
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Segment with Natural Language</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">              <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-white">
              Describe your segment in natural language
            </label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                placeholder="e.g., People who haven't shopped in 6 months and spent over ₹5K"
                className="w-full text-black"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-black hover:bg-gray-200 hover:text-black"                onClick={() => {
                  setPrompt("");
                  setSegmentRules(null);
                  setError(null);
                  if (onApplyRules) {
                    onApplyRules([]); // Reset filters in parent component
                  }
                }}
                disabled={!prompt.trim()}
              >
                Clear
              </Button>
            </div>            <p className="text-xs text-gray-500 mt-1">
              Try phrases like "customers who purchased in last week" or "high spenders who visited recently"
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
              <p className="mt-2">Processing your request...</p>
            </div>
          )}          {segmentRules && !isProcessing && (
            <div className="border border-gray-600 rounded p-3 bg-gray-800 bg-opacity-50 my-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Generated Rules:</h3>                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-200 hover:text-black text-xs"
                  onClick={() => {
                    setSegmentRules(null);
                    if (onApplyRules) {
                      onApplyRules([]); // Pass empty array to reset filters in parent component
                    }
                  }}
                >
                  Clear Rules
                </Button>
              </div>
              <ul className="space-y-2">
                {segmentRules.rules.map((rule, index) => (
                  <li key={index} className="text-sm">
                    <span className="bg-blue-500 bg-opacity-30 px-2 py-1 rounded mr-2">{rule.field}</span>
                    <span className="bg-purple-500 bg-opacity-30 px-2 py-1 rounded mr-2">{rule.operator}</span>
                    <span className="bg-green-500 bg-opacity-30 px-2 py-1 rounded">{rule.value}</span>
                    <p className="text-xs text-gray-400 mt-1">{rule.humanReadable}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="mr-2 text-black hover:text-black hover:bg-gray-100"
          >
            Cancel
          </Button>
          {!segmentRules && (
            <Button 
              disabled={isProcessing || !prompt.trim()} 
              onClick={handleGenerateRules}
            >
              Generate Rules
            </Button>
          )}
          {segmentRules && (
            <>              <Button 
                variant="outline"
                onClick={() => {
                  setSegmentRules(null);
                  if (onApplyRules) {
                    onApplyRules([]); // Reset filters in parent component
                  }
                }}
                className="mr-2 text-black"
              >
                Edit Description
              </Button>
              <Button 
                onClick={handleApplyRules}
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Rules
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
