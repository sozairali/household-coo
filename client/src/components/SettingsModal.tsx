import { useState } from 'react';
import { X, Mail, MessageSquare, Copy, Plus } from 'lucide-react';
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
    addFunds
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

  const handleCopyBotId = () => {
    navigator.clipboard.writeText(integrations.whatsappBotId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border" data-testid="settings-modal">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg min-h-[50px] min-w-[50px] flex items-center justify-center"
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
            <h3 className="text-lg font-semibold text-foreground mb-4">Integrations</h3>
            
            {/* Gmail Integration */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg mb-4 bg-muted/20">
              <div className="flex items-center space-x-3">
                <Mail className="text-chart-1 text-xl w-6 h-6" />
                <div>
                  <div className="font-medium text-foreground">Gmail</div>
                  <div className={`text-sm ${integrations.gmailConnected ? 'text-chart-2' : 'text-chart-3'}`}>
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
            <div className="p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="text-chart-2 text-xl w-6 h-6" />
                  <div>
                    <div className="font-medium text-foreground">WhatsApp Bot</div>
                    <div className={`text-sm ${integrations.whatsappBotConnected ? 'text-chart-2' : 'text-chart-3'}`}>
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
              <div className="bg-muted rounded-lg p-3">
                <label className="block text-sm font-medium text-muted-foreground mb-1">WhatsApp Bot ID</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={integrations.whatsappBotId}
                    readOnly
                    className="flex-grow bg-background border-border text-foreground"
                    data-testid="input-bot-id"
                  />
                  <Button
                    onClick={handleCopyBotId}
                    variant="outline"
                    size="sm"
                    className="min-h-[44px] border-border hover:bg-muted"
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
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Budget</h3>
            
            {/* Current Balance */}
            <div className="bg-chart-2/10 border border-chart-2/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-chart-2 font-medium">Current Balance:</span>
                <span className="text-2xl font-bold text-chart-2" data-testid="text-current-balance">
                  ${budget.balanceUsd.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Add Funds */}
            <div className="border border-border rounded-lg p-4 mb-4 bg-muted/20">
              <h4 className="font-medium text-foreground mb-3">Add Funds</h4>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-muted border border-border rounded-lg px-3 py-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="10.00"
                    step="0.01"
                    min="0"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="bg-transparent border-none outline-none w-20 text-right p-0 focus-visible:ring-0 text-foreground"
                    data-testid="input-add-funds"
                  />
                </div>
                <Button
                  onClick={handleAddFunds}
                  disabled={addFundsLoading || !addFundsAmount || parseFloat(addFundsAmount) <= 0}
                  className="min-h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground"
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
              <p className="text-xs text-muted-foreground mt-2">
                Cost per instruction: ${budget.costPerInstructionUsd.toFixed(2)}
              </p>
            </div>
            
            {/* Recent Transactions */}
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <h4 className="font-medium text-foreground mb-3">Recent Transactions</h4>
              <div className="space-y-2 text-sm">
                {budget.ledger.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-2">
                      {tx.type === 'add' ? (
                        <Plus className="text-chart-2 w-4 h-4" />
                      ) : (
                        <span className="text-muted-foreground w-4 h-4 flex items-center justify-center text-xs">−</span>
                      )}
                      <span className="text-foreground">{tx.note}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${tx.type === 'add' ? 'text-chart-2' : 'text-muted-foreground'}`}>
                        {tx.type === 'add' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(tx.ts), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
