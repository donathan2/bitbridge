import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, DollarSign, Crown, Check } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTitles } from '@/hooks/useUserTitles';
import { toast } from "@/components/ui/use-toast";

const BitVault = () => {
  const { profile } = useUserProfile();
  const { titles, purchaseTitle } = useUserTitles();

  // Reorder titles to group by tiers
  const titleOrder = [
    'Hello World Coder',
    '404 Not Found',
    'Print Debugger',
    'Hotfix Hero',
    'Frontend Forager',
    'Backend Bandit',
    'Web Wizard',
    'Meta Intern',
    'Leetcode Legend',
    'Byte Baron',
    'Godmode Engineer',
    'AI Whisperer',
    'The Compiler',
    'The Interpreter',
    'ML Maniac'
  ];

  const orderedTitles = titleOrder
    .map(name => titles.find(title => title.name === name))
    .filter(Boolean);

  const handlePurchase = async (title: any) => {
    const result = await purchaseTitle(title.id, title.bits_price, title.bytes_price);
    
    if (result.success) {
      toast({
        title: "Title Purchased!",
        description: `You've successfully purchased "${title.name}". You can now set it as your active title in Settings.`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error || "Failed to purchase title",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-pixel text-cyan-400 mb-2">BitVault</h1>
          <p className="text-lg text-slate-300 font-light">
            Unlock exclusive titles to showcase your coding achievements
          </p>
        </div>

        {/* Currency Display */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-pixel text-white mb-4">Your Currency</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Bitcoin className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">
                {profile?.bits_currency?.toLocaleString() || 0}
              </span>
              <span className="text-slate-400">Bits</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">
                {profile?.bytes_currency || 0}
              </span>
              <span className="text-slate-400">Bytes</span>
            </div>
          </div>
        </div>

        {/* Titles Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-pixel text-white mb-6">Available Titles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedTitles.map((title) => (
              <Card key={title.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-cyan-400" />
                      <span className="text-lg truncate" title={title.name}>
                        {title.name}
                      </span>
                    </div>
                    {title.owned && (
                      <Badge variant="outline" className="border-green-500 text-green-400 w-fit">
                        <Check className="w-3 h-3 mr-1" />
                        Owned
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    {title.bits_price > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bitcoin className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400">{title.bits_price.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {title.bytes_price > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400">{title.bytes_price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(title)}
                    disabled={title.owned}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {title.owned ? 'Owned' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitVault;
