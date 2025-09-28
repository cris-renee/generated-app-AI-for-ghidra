import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatService } from '@/lib/chat';
import { cn } from '@/lib/utils';
const analysisActions = [
  { id: 'explain', label: 'EXPLAIN LOGIC' },
  { id: 'vulnerabilities', label: 'FIND VULNERABILITIES' },
  { id: 'refactor', label: 'SUGGEST REFACTORING' },
  { id: 'python', label: 'TRANSLATE TO PYTHON' },
];
const BlinkingCursor = () => (
  <motion.div
    className="w-2 h-8 bg-brutalist-yellow inline-block"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);
export function HomePage() {
  const [inputCode, setInputCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [analysisResult]);
  const handleAnalysis = async (actionId: string, actionLabel: string) => {
    if (!inputCode.trim() || isLoading) return;
    setIsLoading(true);
    setAnalysisResult('');
    setCurrentAction(actionLabel);
    const prompt = `
      Analyze the following C/C++ code snippet for the action: "${actionLabel}".
      Provide a clear, well-formatted response using Markdown.
      - Use headings for sections.
      - Use code blocks for any code examples.
      - Use lists for bullet points.
      Code to analyze:
      \`\`\`c
      ${inputCode}
      \`\`\`
    `;
    try {
      await chatService.sendMessage(prompt, undefined, (chunk) => {
        setAnalysisResult((prev) => prev + chunk);
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult('// ERROR: FAILED TO GET ANALYSIS FROM AI. PLEASE TRY AGAIN.');
    } finally {
      setIsLoading(false);
      setCurrentAction(null);
    }
  };
  const handleClear = () => {
    setInputCode('');
    setAnalysisResult('');
    setIsLoading(false);
    setCurrentAction(null);
  };
  const handleLoadFileClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setInputCode(text);
          setAnalysisResult(`// SUCCESS: LOADED FILE "${file.name}"`);
        }
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        setAnalysisResult(`// ERROR: FAILED TO READ FILE "${file.name}"`);
      };
      reader.readAsText(file);
    }
    // Reset file input value to allow loading the same file again
    if(event.target) {
      event.target.value = '';
    }
  };
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-mono flex flex-col">
      <header className="p-8 border-b-2 border-black dark:border-white">
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
          Ghidra Brutalist
        </h1>
        <p className="text-lg md:text-xl">AI Decompilation Assistant</p>
      </header>
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Column: Input & Actions */}
        <div className="w-full md:w-3/5 flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-black dark:border-white">
          <div className="flex-grow p-8 flex flex-col">
            <label htmlFor="code-input" className="text-2xl font-bold uppercase mb-4">
              Decompiled Code (C/C++)
            </label>
            <textarea
              id="code-input"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="// Paste your decompiled code here or load a file..."
              className="w-full flex-grow bg-transparent border-2 border-black dark:border-white p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-brutalist-yellow"
              spellCheck="false"
            />
          </div>
          <div className="p-8 border-t-2 border-black dark:border-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysisActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAnalysis(action.id, action.label)}
                  disabled={isLoading || !inputCode.trim()}
                  className={cn(
                    'p-4 text-xl font-bold uppercase border-2 border-black dark:border-brutalist-yellow bg-brutalist-yellow text-black transition-all duration-75',
                    'hover:bg-black hover:text-brutalist-yellow dark:hover:bg-brutalist-yellow dark:hover:text-black',
                    'active:scale-95',
                    'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-500'
                  )}
                >
                  {isLoading && currentAction === action.label ? 'ANALYZING...' : action.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileLoad}
                className="hidden"
                accept=".c,.cpp,.h,.hpp,.txt"
              />
              <button
                onClick={handleLoadFileClick}
                className="w-full p-4 text-xl font-bold uppercase border-2 border-black dark:border-white bg-white text-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black active:scale-95 flex items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6" /> LOAD FILE
              </button>
              <button
                onClick={handleClear}
                className="w-full p-4 text-xl font-bold uppercase border-2 border-black dark:border-white bg-black text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white active:scale-95"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
        {/* Right Column: Output */}
        <div className="w-full md:w-2/5 flex flex-col">
          <div className="p-8 border-b-2 border-black dark:border-white flex items-center gap-4">
            <Terminal className="w-8 h-8" />
            <h2 className="text-2xl font-bold uppercase">Analysis Output</h2>
          </div>
          <div ref={outputRef} className="flex-grow p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isLoading && !analysisResult && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <BlinkingCursor />
                </motion.div>
              )}
              {analysisResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose dark:prose-invert prose-sm md:prose-base max-w-none"
                >
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  {isLoading && <span className="inline-block w-2 h-5 bg-brutalist-yellow animate-pulse ml-1"></span>}
                </motion.div>
              )}
              {!isLoading && !analysisResult && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500"
                >
                  <p>// OUTPUT WILL APPEAR HERE</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}