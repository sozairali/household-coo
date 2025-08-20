import { useState } from 'react';
import { Mail, MessageSquare, CheckCircle, ArrowRight, Wifi, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function SetupPage() {
  const [, setLocation] = useLocation();
  const [gmailAddress, setGmailAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [importantCategories, setImportantCategories] = useState<string[]>([]);
  
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'gmail',
      title: 'Connect Email',
      description: 'Enter your email address to monitor important messages',
      icon: Mail,
      completed: false
    },
    {
      id: 'whatsapp',
      title: 'Setup WhatsApp Bot',
      description: 'Create a WhatsApp bot for family notifications',
      icon: MessageSquare,
      completed: false
    },
    {
      id: 'priorities',
      title: 'Choose Priorities',
      description: 'Select what matters most to your household',
      icon: Users,
      completed: false
    }
  ]);

  const priorityOptions = [
    'Healthcare appointments',
    'School deadlines',
    'Financial savings',
    'Bill payments',
    'Family events',
    'Home maintenance',
    'Travel planning',
    'Insurance claims'
  ];

  const markStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const handleEmailConnect = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(gmailAddress)) {
      markStepComplete('gmail');
    }
  };

  const handleWhatsAppSetup = () => {
    if (whatsappNumber.length > 0) {
      markStepComplete('whatsapp');
    }
  };

  const handlePriorityToggle = (priority: string) => {
    setImportantCategories(prev => {
      const updated = prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority];
      
      return updated;
    });
  };

  const allStepsCompleted = steps.every(step => step.completed);

  const handleFinishSetup = () => {
    // In a real app, this would save the settings
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900" data-testid="page-setup">
      {/* Header */}
      <header className="bg-gray-800 border-b-2 border-gray-600 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Wifi className="text-blue-400 w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold text-white">Household COO Setup</h1>
              <p className="text-gray-300 text-sm">Let's get your family organized in 3 simple steps</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = true; // Allow all steps to be accessible in any order
            
            return (
              <div 
                key={step.id}
                className={`bg-gray-800 rounded-2xl border-2 p-8 transition-all ${
                  step.completed ? 'border-green-500 bg-green-900/20' : 
                  isActive ? 'border-blue-500' : 'border-gray-600 opacity-50'
                }`}
                data-testid={`setup-step-${step.id}`}
              >
                <div className="flex items-start space-x-6">
                  {/* Step Icon */}
                  <div className={`p-4 rounded-full ${
                    step.completed ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <Icon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                    <p className="text-gray-300 mb-6">{step.description}</p>
                    
                    {/* Step-specific content */}
                    {step.id === 'gmail' && !step.completed && isActive && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="flex space-x-4">
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              value={gmailAddress}
                              onChange={(e) => setGmailAddress(e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-grow"
                              data-testid="input-email"
                            />
                            <Button
                              onClick={handleEmailConnect}
                              disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmailAddress)}
                              className="bg-blue-600 hover:bg-blue-500 text-white min-h-[44px]"
                              data-testid="button-connect-email"
                            >
                              Connect
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          AI will monitor this inbox for important messages and deadlines (supports any email provider)
                        </p>
                      </div>
                    )}
                    
                    {step.id === 'whatsapp' && !step.completed && isActive && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            WhatsApp Number
                          </label>
                          <div className="flex space-x-4">
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-grow"
                              data-testid="input-whatsapp"
                            />
                            <Button
                              onClick={handleWhatsAppSetup}
                              disabled={whatsappNumber.length === 0}
                              className="bg-green-600 hover:bg-green-500 text-white min-h-[44px]"
                              data-testid="button-setup-whatsapp"
                            >
                              Create Bot
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-xs text-gray-300 mb-2">
                            <strong>Your Bot ID:</strong> +1-555-COO-HELP
                          </p>
                          <p className="text-xs text-gray-400">
                            Share this number with family members so they can send you reminders
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {step.id === 'priorities' && !step.completed && isActive && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-300">
                          Select the categories that are most important for your household:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {priorityOptions.map((priority) => (
                            <button
                              key={priority}
                              onClick={() => handlePriorityToggle(priority)}
                              className={`text-left p-3 rounded-lg border transition-colors ${
                                importantCategories.includes(priority)
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                              }`}
                              data-testid={`priority-${priority.replace(/\s+/g, '-').toLowerCase()}`}
                            >
                              <span className="text-xs font-medium">{priority}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Select multiple categories that matter to your household
                        </p>
                        {importantCategories.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-300 mb-2">
                              Selected: {importantCategories.length} categories
                            </p>
                            <Button
                              onClick={() => markStepComplete('priorities')}
                              className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-4 px-8 border-4 border-green-400 shadow-2xl ring-4 ring-green-300 ring-opacity-50 min-h-[64px] w-full"
                              data-testid="button-save-priorities"
                            >
                              <span className="mr-2 text-2xl">✓</span>
                              Save Priorities ({importantCategories.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {step.completed && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Finish Button */}
        {allStepsCompleted && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleFinishSetup}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 text-lg min-h-[60px]"
              data-testid="button-finish-setup"
            >
              Start Managing Your Household
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}