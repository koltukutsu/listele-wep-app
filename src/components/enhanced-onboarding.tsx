"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Confetti } from "./magicui/confetti";
import { Loader2, Sparkles, Users, TrendingUp, Zap, Eye, Share2, BarChart3, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { auth } from "~/lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { trackOnboardingStep } from "../lib/analytics";
import { isPaymentEnabled } from "~/lib/config";

const SAMPLE_IDEAS = [
  "Turkish coffee subscription box - monthly special coffees from different regions",
  "Project management platform for freelancers - AI-powered time tracking",
  "Eco-friendly product marketplace for sustainable living",
  "Online Turkish language course - conversation practice focused",
  "Pet-friendly cafe and venue finder mobile app"
];

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  valueProps: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "🚀 Welcome to Founder Mode!",
    subtitle: "Let's see how it works for you",
    description: "Discover your smart assistant that will support you on your entrepreneurial journey. First, would you like to see how fast it works?",
    action: "See Sample Project",
    icon: <Sparkles className="w-6 h-6" />,
    valueProps: [
      "⚡ Professional landing page in 30 seconds",
      "🤖 AI-powered content creation",
      "📊 Instant customer collection system"
    ]
  },
  {
    id: 2,
    title: "⚡ Amazing! Now It's Your Turn",
    subtitle: "Time to bring your idea to life",
    description: "As you can see, making a great start only takes a few seconds. Now tell us your brilliant idea, and we'll handle the rest!",
    action: "Create My Idea",
    icon: <Zap className="w-6 h-6" />,
    valueProps: [
      "💡 Works for any idea you have",
      "🎨 Design tailored to your brand",
      "📝 Professional text content"
    ]
  },
  {
    id: 3,
    title: "🎨 Perfect! Now Personalize",
    subtitle: "Your project is ready, let's add the final touches",
    description: "Your AI assistant has made a great start for you! Now make the project completely yours by adding brand-specific colors, texts, and features.",
    action: "Explore Editor",
    icon: <Eye className="w-6 h-6" />,
    valueProps: [
      "🎯 See instantly with live preview",
      "🎨 Unlimited design freedom",
      "✨ Professional templates"
    ]
  },
  {
    id: 4,
    title: "📣 Share with the World and Grow!",
    subtitle: "Start collecting your first customers",
    description: "Publish your project and start sharing immediately! Every link click is a potential customer, every registration is proof of your startup's power.",
    action: "Publish Project",
    icon: <Share2 className="w-6 h-6" />,
    valueProps: [
      "🌍 Go live instantly",
      "📱 Perfect appearance on all devices",
      "🔥 Viral sharing features"
    ]
  },
  {
    id: 5,
    title: "📊 Track and Analyze Your Success",
    subtitle: "Build your growth strategy with data",
    description: "Track every development in your project with real-time analytics. Which channels customers come from, your conversion rates, and much more!",
    action: "View Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    valueProps: [
      "📈 Real-time customer tracking",
      "🎯 Conversion optimization",
      "🌟 Competitive analysis"
    ]
  }
];

export function EnhancedOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [showSampleDemo, setShowSampleDemo] = useState(false);
  const [sampleProjectId, setSampleProjectId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const router = useRouter();

  // Check payment enabled status and redirect to dashboard if disabled
  useEffect(() => {
    const paymentEnabled = isPaymentEnabled();
    if (!paymentEnabled) {
      console.log('Payment disabled, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
  }, [router]);

  // Track onboarding analytics
  useEffect(() => {
    trackOnboardingStep(currentStep, 'step_view');
  }, [currentStep]);

  // Debug environment variables
  useEffect(() => {
    console.log('NEXT_PUBLIC_PAYMENT_ENABLED:', process.env.NEXT_PUBLIC_PAYMENT_ENABLED);
    console.log('Environment check - Payment enabled:', process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true');
  }, []);

  // Sample idea rotation
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSampleIndex((prev) => (prev + 1) % SAMPLE_IDEAS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSampleDemo = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user found');
        alert('Please log in first.');
        setLoading(false);
        return;
      }
      
      const token = await user.getIdToken();
      const sampleIdea = SAMPLE_IDEAS[Math.floor(Math.random() * SAMPLE_IDEAS.length)];

      console.log('Sending request to generate sample project with idea:', sampleIdea);

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: sampleIdea, isDemo: true }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Project generated successfully:', data);
        setSampleProjectId(data.projectId);
        setShowSampleDemo(true);
        trackOnboardingStep(1, 'demo_generated');
        setTimeout(() => {
          setShowSampleDemo(false);
          setCurrentStep(2);
          trackOnboardingStep(1, 'completed');
        }, 8000);
      } else {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        
        if (response.status === 403 && errorData.error === 'AI features are not currently available') {
          alert('AI features are currently unavailable. Please try again later.');
        } else {
          alert(`An error occurred: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error in handleSampleDemo:', error);
      alert('Connection error. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user found');
        alert('Please log in first.');
        setLoading(false);
        return;
      }
      
      const token = await user.getIdToken();

      console.log('Sending request to generate project with prompt:', prompt);

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Project generated successfully:', data);
        setProjectId(data.projectId);
        trackOnboardingStep(2, 'project_created');
        setCompletedSteps(prev => [...prev, 2]);
        setCurrentStep(3);
      } else {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        
        if (response.status === 403 && errorData.error === 'AI features are not currently available') {
          alert('AI features are currently unavailable. Please try again later.');
        } else if (response.status === 403 && errorData.error === 'Project limit reached.') {
          alert('Your project limit has been reached. Please upgrade your plan.');
        } else {
          alert(`An error occurred: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error in handleCreateProject:', error);
      alert('Connection error. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    trackOnboardingStep(currentStep, 'completed');
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (currentStep === 3 && projectId) {
      // Track time to first project
      const timeToProject = Date.now() - startTime;
      trackOnboardingStep(currentStep, 'time_to_project', { timeMs: timeToProject });
      router.push(`/dashboard/editor/${projectId}?onboarding=true`);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep - 1];

  if (showSampleDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-lime-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <Confetti />
            <div className="animate-pulse mb-6">
              <Sparkles className="w-16 h-16 mx-auto text-lime-400 mb-4" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 bg-clip-text text-transparent">
              ✨ AI Founder Mode is Working!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Creating a sample project for you...
            </p>
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 mb-6 border border-lime-200 dark:border-slate-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current idea being generated:</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                "{SAMPLE_IDEAS[currentSampleIndex]}"
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2">Creating professional landing page...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep} / {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="overflow-hidden shadow-xl border-lime-200 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-r from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-600 text-black dark:text-white p-8">
            <div className="flex items-center space-x-4">
              <div className="bg-black/10 dark:bg-white/20 p-3 rounded-full">
                {currentStepData.icon}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold mb-2">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-black/70 dark:text-white/80 text-lg">
                  {currentStepData.subtitle}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 bg-white dark:bg-slate-900">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Main Content */}
              <div className="space-y-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Step-specific content */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-lime-50 dark:bg-slate-800 border border-lime-200 dark:border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold text-lime-800 dark:text-lime-400 mb-2">🎯 What Are We Going to Do?</h4>
                      <p className="text-lime-700 dark:text-lime-300 text-sm">
                        First, we'll show you how it works, and then you'll create your own idea!
                      </p>
                    </div>
                    <Button 
                      onClick={handleSampleDemo}
                      disabled={loading || process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true'}
                      size="lg"
                      className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Sample...
                        </>
                      ) : process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true' ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          AI Features Unavailable
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          {currentStepData.action}
                        </>
                      )}
                    </Button>
                    {process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true' && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        💡 AI features are currently unavailable. To work in developer mode, 
                        <code className="mx-1 px-2 py-1 bg-amber-100 dark:bg-amber-800 rounded text-xs">NEXT_PUBLIC_PAYMENT_ENABLED=true</code> 
                        environment variable.
                      </p>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">💡 Need Inspiration?</h4>
                      <p className="text-green-700 dark:text-green-300 text-sm mb-3">Here are a few ideas:</p>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        "{SAMPLE_IDEAS[currentSampleIndex]}"
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Describe your idea in detail (what, how, for whom):
                      </label>
                      <textarea
                        className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        placeholder="Example: Online Turkish cooking course platform. For housewives and food enthusiasts, video lessons, live cooking shows, and community features. Monthly subscription model..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Tip: The more details you provide, the better the result!
                      </div>
                    </div>
                    <Button 
                      onClick={handleCreateProject}
                      disabled={loading || !prompt.trim() || process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true'}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Working on AI...
                        </>
                      ) : process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true' ? (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          AI Features Unavailable
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          {currentStepData.action}
                        </>
                      )}
                    </Button>
                    {process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== 'true' && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        💡 AI features are currently unavailable. To work in developer mode, 
                        <code className="mx-1 px-2 py-1 bg-amber-100 dark:bg-amber-800 rounded text-xs">NEXT_PUBLIC_PAYMENT_ENABLED=true</code> 
                        environment variable.
                      </p>
                    )}
                  </div>
                )}

                {currentStep >= 3 && (
                  <div className="space-y-4">
                    <div className="bg-lime-50 dark:bg-slate-800 border border-lime-200 dark:border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold text-lime-800 dark:text-lime-400 mb-2">🎉 Congratulations!</h4>
                      <p className="text-lime-700 dark:text-lime-300 text-sm">
                        Your project is ready! Now it's time to refine and grow it.
                      </p>
                    </div>
                    <Button 
                      onClick={handleNextStep}
                      size="lg"
                      className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black dark:text-white"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      {currentStepData.action}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column - Value Props */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-lime-500" />
                    What You'll Gain in This Step:
                  </h4>
                  <div className="space-y-3">
                    {currentStepData.valueProps.map((prop, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step completion badges */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Progress:</h4>
                  <div className="space-y-2">
                    {ONBOARDING_STEPS.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3">
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle className="h-5 w-5 text-lime-500" />
                        ) : currentStep === step.id ? (
                          <div className="h-5 w-5 border-2 border-lime-500 rounded-full bg-lime-100 dark:bg-lime-900"></div>
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                        )}
                        <span className={`text-sm ${
                          completedSteps.includes(step.id) 
                            ? 'text-lime-600 dark:text-lime-400 font-medium' 
                            : currentStep === step.id 
                            ? 'text-lime-600 dark:text-lime-400 font-medium'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.title.replace(/[🚀⚡🎨📣📊]/g, '').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial/Social Proof */}
                <div className="bg-gray-50 dark:bg-slate-800 border border-lime-200 dark:border-slate-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-lime-500" />
                    What Other Founders Say:
                  </h4>
                  <blockquote className="text-sm text-gray-600 dark:text-gray-400 italic">
                    "With Launch List, I can do what used to take me 2 hours in just 2 minutes. Unbelievable!"
                  </blockquote>
                  <cite className="text-xs text-gray-500 dark:text-gray-400 block mt-2">— Ahmet K., SaaS Founder</cite>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep <= 1}
                className="flex items-center border-lime-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Every step brings you closer to success 🚀
                </p>
              </div>

              {currentStep < 3 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600"
                >
                  Complete Later
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 