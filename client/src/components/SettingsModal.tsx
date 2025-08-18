import { useState } from 'react';
import { X, Mail, MessageSquare, Copy, Download, Upload, RotateCcw, Plus } from 'lucide-react';
import { useAppStore } from '@/state/store';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    integrations,
    budget,
    toggleIntegration,
    addFunds,
    exportData,
    importData,
    resetDemo
  } = useAppStore();

  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [addFundsLoading, setAddFundsLoading] = useState(false);

  const handleAddFunds = async () => {
    const amount = parseFloat(addFundsAmount);
    if (amount > 0) {
      setAddFundsLoading(true);
      addFunds(amount);
      setAddFundsAmount('');
      
      // Show success feedback
      setTimeout(() => {
        setAddFundsLoading(false);
      }, 1000);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `household-coo-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            importData(data);
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCopyBotId = () => {
    navigator.clipboard.writeText(integrations.whatsappBotId);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetDemo();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="settings-modal">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg min-h-[50px] min-w-[50px]"
            data-testid="button-close-settings"
            aria-label="Close"
          >
            <X className="text-xl w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Integrations Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
            
            {/* Gmail Integration */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600 text-xl w-6 h-6" />
                <div>
                  <div className="font-medium text-gray-900">Gmail</div>
                  <div className={`text-sm ${integrations.gmailConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                    {integrations.gmailConnected ? 'Connected' : 'Needs attention'}
                  </div>
                </div>
              </div>
              <Switch
                checked={integrations.gmailConnected}
                onCheckedChange={() => toggleIntegration('gmail')}
                data-testid="switch-gmail"
              />
            </div>
            
            {/* WhatsApp Integration */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="text-green-600 text-xl w-6 h-6" />
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp Bot</div>
                    <div className={`text-sm ${integrations.whatsappBotConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                      {integrations.whatsappBotConnected ? 'Connected' : 'Needs attention'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={integrations.whatsappBotConnected}
                  onCheckedChange={() => toggleIntegration('whatsapp')}
                  data-testid="switch-whatsapp"
                />
              </div>
              
              {/* Bot ID */}
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Bot ID</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={integrations.whatsappBotId}
                    readOnly
                    className="flex-grow bg-white"
                    data-testid="input-bot-id"
                  />
                  <Button
                    onClick={handleCopyBotId}
                    variant="outline"
                    size="sm"
                    className="min-h-[44px]"
                    data-testid="button-copy-bot-id"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Budget Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Budget</h3>
            
            {/* Current Balance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Current Balance:</span>
                <span className="text-2xl font-bold text-green-800" data-testid="text-current-balance">
                  ${budget.balanceUsd.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Add Funds */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Add Funds</h4>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                  <span className="text-gray-500">$</span>
                  <Input
                    type="number"
                    placeholder="10.00"
                    step="0.01"
                    min="0"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="bg-transparent border-none outline-none w-20 text-right p-0 focus-visible:ring-0"
                    data-testid="input-add-funds"
                  />
                </div>
                <Button
                  onClick={handleAddFunds}
                  disabled={addFundsLoading || !addFundsAmount || parseFloat(addFundsAmount) <= 0}
                  className="min-h-[44px]"
                  data-testid="button-add-funds"
                >
                  {addFundsLoading ? (
                    'Added!'
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Funds
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Cost per instruction: ${budget.costPerInstructionUsd.toFixed(2)}
              </p>
            </div>
            
            {/* Recent Transactions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Recent Transactions</h4>
              <div className="space-y-2 text-sm">
                {budget.ledger.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      {tx.type === 'add' ? (
                        <Plus className="text-green-600 w-4 h-4" />
                      ) : (
                        <span className="text-gray-600 w-4 h-4 flex items-center justify-center text-xs">−</span>
                      )}
                      <span className="text-gray-900">{tx.note}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${tx.type === 'add' ? 'text-green-600' : 'text-gray-600'}`}>
                        {tx.type === 'add' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {format(new Date(tx.ts), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Data Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data</h3>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleExport}
                variant="outline"
                className="min-h-[44px]"
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <Button
                onClick={handleImport}
                variant="outline"
                className="min-h-[44px]"
                data-testid="button-import-data"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="min-h-[44px] text-red-600 border-red-200 hover:bg-red-50"
                data-testid="button-reset-demo"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
