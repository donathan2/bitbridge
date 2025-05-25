
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, DollarSign, Star, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTitles } from '@/hooks/useUserTitles';
import { toast } from '@/components/ui/use-toast';

const BitVault = () => {
  const [selectedTitle, setSelectedTitle] = useState<any>(null);
  const { profile } = useUserProfile();
  const { titles, loading: titlesLoading, purchaseTitle } = useUserTitles();
  
  // Use actual user currency from profile
  const userCurrency = {
    bits: profile?.bits_currency || 0,
    bytes: profile?.bytes_currency || 0
  };

  const canAfford = (bitsPrice: number, bytesPrice: number) => {
    return userCurrency.bits >= bitsPrice && userCurrency.bytes >= bytesPrice;
  };

  const handlePurchase = async (title: any) => {
    if (title.owned) {
      toast({
        title: "Already Owned",
        description: "You already own this title!",
        variant: "default",
      });
      return;
    }

    if (!canAfford(title.bits_price, title.bytes_price)) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough bits or bytes to purchase this title.",
        variant: "destructive",
      });
      return;
    }

    const result = await purchaseTitle(title.id, title.bits_price, title.bytes_price);
    
    if (result.success) {
      toast({
        title: "Title Purchased!",
        description: `You've successfully purchased "${title.name}"!`,
        variant: "default",
      });
      setSelectedTitle(null);
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error || "Failed to purchase title",
        variant: "destructive",
      });
    }
  };

  const getTitleColor = (title: any) => {
    if (title.bits_price >= 20000 || title.bytes_price >= 100) return "from-purple-500 to-pink-600";
    if (title.bits_price >= 10000 || title.bytes_price >= 75) return "from-yellow-500 to-orange-600";
    if (title.bits_price >= 5000 || title.bytes_price >= 50) return "from-blue-500 to-cyan-600";
    if (title.bits_price >= 1000 || title.bytes_price >= 25) return "from-green-500 to-emerald-600";
    return "from-slate-500 to-slate-600";
  };

  if (titlesLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">BitVault</h1>
            <p className="text-lg text-slate-300 font-light">Loading titles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">BitVault</h1>
          <p className="text-lg text-slate-300 font-light">Unlock prestigious developer titles with your earnings</p>
        </div>

        {/* Currency Display */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex justify-center gap-8">
              <div className="bg-slate-700 px-6 py-4 rounded-lg flex items-center gap-3">
                <Bitcoin className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-bold text-2xl">{userCurrency.bits.toLocaleString()}</p>
                  <p className="text-slate-300 text-sm">Bits Available</p>
                </div>
              </div>
              <div className="bg-slate-700 px-6 py-4 rounded-lg flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-purple-400 font-bold text-2xl">{userCurrency.bytes}</p>
                  <p className="text-slate-300 text-sm">Bytes Available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Titles Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-cyan-400" />
            Developer Titles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {titles.map((title) => {
              const affordable = canAfford(title.bits_price, title.bytes_price);
              const color = getTitleColor(title);
              
              return (
                <Card 
                  key={title.id} 
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:shadow-lg ${
                    affordable && !title.owned ? 'hover:shadow-cyan-500/20' : 'opacity-75'
                  } ${title.owned ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedTitle(title)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-3`}>
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{title.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {title.owned && (
                        <Badge className="bg-green-600 text-white text-xs mb-2">
                          Owned
                        </Badge>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          {title.bits_price > 0 && (
                            <div className="flex items-center gap-1">
                              <Bitcoin className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400">{title.bits_price.toLocaleString()}</span>
                            </div>
                          )}
                          {title.bytes_price > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400">{title.bytes_price}</span>
                            </div>
                          )}
                        </div>
                        {!affordable && !title.owned && (
                          <Badge variant="destructive" className="text-xs">
                            Can't Afford
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Purchase Dialog */}
        <Dialog open={!!selectedTitle} onOpenChange={(open) => !open && setSelectedTitle(null)}>
          <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                {selectedTitle?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Unlock this prestigious developer title
              </DialogDescription>
            </DialogHeader>
            
            {selectedTitle && (
              <div className="space-y-6 mt-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Cost</h3>
                  <div className="flex items-center gap-4">
                    {selectedTitle.bits_price > 0 && (
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{selectedTitle.bits_price.toLocaleString()}</span>
                        <span className="text-slate-300">Bits</span>
                      </div>
                    )}
                    {selectedTitle.bytes_price > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-bold">{selectedTitle.bytes_price}</span>
                        <span className="text-slate-300">Bytes</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Developer Title</h3>
                  <p className="text-white">Show off your achievements with this exclusive title!</p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="border-slate-600 text-slate-300" 
                    onClick={() => setSelectedTitle(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className={`${
                      selectedTitle.owned 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : canAfford(selectedTitle.bits_price, selectedTitle.bytes_price) 
                          ? 'bg-cyan-600 hover:bg-cyan-700' 
                          : 'bg-slate-600 cursor-not-allowed'
                    } text-white`}
                    onClick={() => handlePurchase(selectedTitle)}
                    disabled={selectedTitle.owned || !canAfford(selectedTitle.bits_price, selectedTitle.bytes_price)}
                  >
                    {selectedTitle.owned 
                      ? 'Already Owned' 
                      : canAfford(selectedTitle.bits_price, selectedTitle.bytes_price) 
                        ? 'Purchase' 
                        : 'Insufficient Funds'
                    }
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BitVault;
