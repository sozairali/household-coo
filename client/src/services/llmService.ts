import { budgetService } from './budgetService';
import { ConnectionError, InsufficientBalanceError } from '@/types';

interface InstructionResponse {
  steps: string[];
  citations: { title: string; url: string }[];
}

class LLMService {
  async getInstructions(taskId: string): Promise<InstructionResponse> {
    const budget = budgetService.get();
    
    try {
      // Charge for the instruction first
      budgetService.charge(budget.costPerInstructionUsd, `Instruction: ${taskId}`);
    } catch (error) {
      if (error instanceof InsufficientBalanceError) {
        throw error;
      }
      throw new Error('Failed to charge for instruction');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // 10% chance of connection error
    if (Math.random() < 0.1) {
      throw new ConnectionError('Failed to connect to AI assistant');
    }

    // Mock instruction responses based on task ID
    const mockResponses: Record<string, InstructionResponse> = {
      't1': {
        steps: [
          'Log into the school portal using your parent credentials',
          'Navigate to "Student Health" → "Immunization Records"',
          'Click "Upload New Records" and select your PDF files',
          'Verify all required vaccinations are listed',
          'Submit and wait for confirmation email'
        ],
        citations: [
          { title: 'School immunization policy', url: 'https://school.example/policy' },
          { title: 'Required vaccination schedule', url: 'https://health.gov/vaccines' }
        ]
      },
      't2': {
        steps: [
          'Log into your AmAir account at example-airline.com',
          'Navigate to "My Account" → "Travel Credits"',
          'Select the $150 credit expiring Friday',
          'Search for flights for your fall trip dates',
          'Apply the credit during checkout before expiration',
          'Confirm booking and save confirmation number'
        ],
        citations: [
          { title: 'Carrier credit policy', url: 'https://example-airline.com/policy' },
          { title: 'How to use travel credits', url: 'https://example-airline.com/help' }
        ]
      },
      't3': {
        steps: [
          'Open the preschool email with deposit information',
          'Note the amount required and payment deadline',
          'Log into your bank\'s online portal',
          'Set up the payment to Sunshine Preschool',
          'Schedule payment to arrive before Monday 5pm deadline',
          'Save confirmation number and reply to school email'
        ],
        citations: [
          { title: 'Preschool payment policy', url: 'https://sunshine-preschool.com/payments' },
          { title: 'Online banking help', url: 'https://yourbank.com/help' }
        ]
      }
    };

    // Return appropriate response or enhanced default
    return mockResponses[taskId] || {
      steps: [
        'Gather all necessary documents, account numbers, and identification before starting',
        'Log into your online account using a secure connection, or call customer service during business hours',
        'Navigate to the relevant section (billing, account settings, or service requests) for this specific task',
        'Read all instructions carefully before proceeding with any changes or payments',
        'Follow the step-by-step process, taking screenshots or notes for your records',
        'Complete the required action and save confirmation numbers, emails, or receipts immediately',
        'Send confirmation to any family members who need to know about this action',
        'Set a calendar reminder to follow up in 7-10 business days if you don\'t receive expected confirmation',
        'Update your household budget or task tracking system with the completion status'
      ],
      citations: [
        { title: 'Customer Support Portal', url: 'https://example.com/support' },
        { title: 'Account Management Help Center', url: 'https://example.com/account' },
        { title: 'Billing and Payment FAQ', url: 'https://example.com/billing-faq' }
      ]
    };
  }
}

export const llmService = new LLMService();
