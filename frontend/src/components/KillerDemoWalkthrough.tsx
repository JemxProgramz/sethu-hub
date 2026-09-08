import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Play,
  Lightbulb,
  Users,
  MessageSquare,
  TrendingUp,
  FileText
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Student creates project request',
    actionText: 'Karthik Raja creates: "I want to build an AI project but I don\'t know who can help me."',
    route: '/post/p-killer-demo',
    icon: FileText
  },
  {
    step: 2,
    title: 'AI analyzes the draft post',
    actionText: 'Agent 1 extracts category, intent ("collaboration"), difficulty, and department relevance (CSD, AI-DS, ECE).',
    route: '/post/p-killer-demo',
    icon: Sparkles
  },
  {
    step: 3,
    title: 'AI recommends Community & Tags',
    actionText: 'AI assigns target community /c/projects and tags #AI #Collaboration #PyTorch.',
    route: '/post/p-killer-demo',
    icon: CheckCircle2
  },
  {
    step: 4,
    title: 'Team Matching Agent finds students',
    actionText: 'Agent 6 matches Deepa S. (AI-DS, PyTorch) and Harish B. (MECH, 3D enclosures) with compatibility scores.',
    route: '/projects/proj-killer-demo',
    icon: Users
  },
  {
    step: 5,
    title: 'Peer students join discussion',
    actionText: 'Deepa comments offering PyTorch edge models; Harish offers CAD 3D printing; Faculty endorses.',
    route: '/post/p-killer-demo',
    icon: MessageSquare
  },
  {
    step: 6,
    title: 'Inter-departmental thread grows',
    actionText: 'Multi-threaded replies form between students and faculty mentor Dr. S. Ramanathan.',
    route: '/post/p-killer-demo',
    icon: MessageSquare
  },
  {
    step: 7,
    title: 'AI summarizes discussion',
    actionText: 'Agent 3 synthesizes key arguments, hardware needs, consensus, and action items with 1 click.',
    route: '/post/p-killer-demo',
    icon: Sparkles
  },
  {
    step: 8,
    title: 'Trend Detector identifies project surge',
    actionText: 'Agent 5 detects +240% spike in cross-department AI project and GPU access discussions.',
    route: '/trending',
    icon: TrendingUp
  },
  {
    step: 9,
    title: 'Idea Mining Agent detects bottleneck',
    actionText: 'Agent 7 correlates project recruitment with GPU OOM errors and lab equipment shortages across 3 departments.',
    route: '/innovation',
    icon: Lightbulb
  },
  {
    step: 10,
    title: 'Sethu Hub generates Innovation Opportunity',
    actionText: 'Official institutional opportunity created: "Inter-Departmental Hardware & GPU Compute Pooling Platform for SIT".',
    route: '/innovation',
    icon: Lightbulb
  }
];

export const KillerDemoWalkthrough: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();

  const step = DEMO_STEPS[currentStepIndex];

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
    navigate(DEMO_STEPS[index].route);
  };

  const handleNext = () => {
    const nextIdx = (currentStepIndex + 1) % DEMO_STEPS.length;
    handleGoToStep(nextIdx);
  };

  return (
    <>
      {/* Floating Demo Trigger Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 py-2.5 sm:py-3 text-xs font-bold text-white shadow-2xl hover:scale-105 transition-all border border-indigo-400/40"
          >
            <Play className="h-4 w-4 fill-current text-white animate-pulse" />
            <span>Interactive 10-Step Demo</span>
          </button>
        )}
      </div>

      {/* Floating Demo Walkthrough Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-3xl bg-[#111827] border-2 border-indigo-500/50 p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {step.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Institutional Walkthrough</h4>
                <p className="text-[10px] text-indigo-400 font-medium">Step {step.step} of 10</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              <step.icon className="h-4 w-4 text-indigo-400" />
              <span>{step.title}</span>
            </h5>
            <p className="mt-2 text-xs text-gray-300 leading-relaxed bg-[#0B0F19] rounded-xl p-3 border border-[#1F2937]">
              {step.actionText}
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="mt-4 flex items-center justify-center gap-1">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleGoToStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-gray-700 hover:bg-gray-500'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#1F2937]">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => handleGoToStep(currentStepIndex - 1)}
              className="text-xs text-gray-400 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Restart Flow' : 'Next Step'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

