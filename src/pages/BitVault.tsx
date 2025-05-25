import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bitcoin, DollarSign, Zap, Star, Shield, Rocket, Brain, Clock, Trophy, Users, Code, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';

const BitVault = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { profile } = useUserProfile();
  
  // Use actual user currency from profile
  const userCurrency = {
    bits: profile?.bits_currency || 0,
    bytes: profile?.bytes_currency || 0
  };

  // Mock user data - in real app this would come from context/store
  const user = {
    currency: {
      bits: userCurrency.bits,
      bytes: userCurrency.bytes
    }
  };

  const powerups = [
    {
      id: 1,
      name: "XP Booster",
      description: "Double XP gains for the next 24 hours",
      icon: Star,
      price: { bits: 500, bytes: 0 },
      duration: "24 hours",
      type: "powerup",
      color: "from-yellow-500 to-amber-600"
    },
    {
      id: 2,
      name: "Skill Accelerator",
      description: "Learn new technologies 50% faster",
      icon: Brain,
      price: { bits: 800, bytes: 2 },
      duration: "7 days",
      type: "powerup",
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 3,
      name: "Project Rush",
      description: "Complete projects 25% faster",
      icon: Rocket,
      price: { bits: 1200, bytes: 3 },
      duration: "3 days",
      type: "powerup",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 4,
      name: "Time Saver",
      description: "Reduce project completion time by 30%",
      icon: Clock,
      price: { bits: 1500, bytes: 5 },
      duration: "5 days",
      type: "powerup",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const perks = [
    {
      id: 5,
      name: "Premium Profile Badge",
      description: "Show off your premium status with a special badge",
      icon: Shield,
      price: { bits: 2000, bytes: 8 },
      type: "perk",
      permanent: true,
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 6,
      name: "Project Priority Access",
      description: "Get first access to new high-reward projects",
      icon: Target,
      price: { bits: 3000, bytes: 12 },
      type: "perk",
      permanent: true,
      color: "from-red-500 to-pink-600"
    },
    {
      id: 7,
      name: "Elite Developer Status",
      description: "Unlock exclusive features and higher rewards",
      icon: Trophy,
      price: { bits: 5000, bytes: 25 },
      type: "perk",
      permanent: true,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 8,
      name: "Team Leader Privileges",
      description: "Create and manage premium project teams",
      icon: Users,
      price: { bits: 4000, bytes: 18 },
      type: "perk",
      permanent: true,
      color: "from-teal-500 to-cyan-600"
    },
    {
      id: 9,
      name: "Code Mentor Access",
      description: "Get 1-on-1 mentoring sessions with senior developers",
      icon: Code,
      price: { bits: 6000, bytes: 30 },
      type: "perk",
      permanent: true,
      color: "from-violet-500 to-purple-600"
    }
  ];

  const canAfford = (price: { bits: number; bytes: number }) => {
    return userCurrency.bits >= price.bits && userCurrency.bytes >= price.bytes;
  };

  const handlePurchase = (item: any) => {
    if (canAfford(item.price)) {
      // In real app, this would make API call to purchase
      console.log(`Purchasing ${item.name} for ${item.price.bits} bits and ${item.price.bytes} bytes`);
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">BitVault</h1>
          <p className="text-lg text-slate-300 font-light">Enhance your coding journey with powerful upgrades</p>
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

        {/* Powerups Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            Temporary Powerups
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {powerups.map((powerup) => {
              const Icon = powerup.icon;
              const affordable = canAfford(powerup.price);
              
              return (
                <Card 
                  key={powerup.id} 
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:shadow-lg ${
                    affordable ? 'hover:shadow-cyan-500/20' : 'opacity-75'
                  }`}
                  onClick={() => setSelectedItem(powerup)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${powerup.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{powerup.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4">{powerup.description}</p>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                        Duration: {powerup.duration}
                      </Badge>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          {powerup.price.bits > 0 && (
                            <div className="flex items-center gap-1">
                              <Bitcoin className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400">{powerup.price.bits}</span>
                            </div>
                          )}
                          {powerup.price.bytes > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400">{powerup.price.bytes}</span>
                            </div>
                          )}
                        </div>
                        {!affordable && (
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

        {/* Perks Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Permanent Perks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk) => {
              const Icon = perk.icon;
              const affordable = canAfford(perk.price);
              
              return (
                <Card 
                  key={perk.id} 
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:shadow-lg ${
                    affordable ? 'hover:shadow-cyan-500/20' : 'opacity-75'
                  }`}
                  onClick={() => setSelectedItem(perk)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${perk.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{perk.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4">{perk.description}</p>
                    <div className="space-y-2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs">
                        Permanent Upgrade
                      </Badge>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          {perk.price.bits > 0 && (
                            <div className="flex items-center gap-1">
                              <Bitcoin className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400">{perk.price.bits.toLocaleString()}</span>
                            </div>
                          )}
                          {perk.price.bytes > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400">{perk.price.bytes}</span>
                            </div>
                          )}
                        </div>
                        {!affordable && (
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
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
                {selectedItem && (
                  <>
                    <selectedItem.icon className="w-6 h-6" />
                    {selectedItem.name}
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {selectedItem?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-6 mt-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Cost</h3>
                  <div className="flex items-center gap-4">
                    {selectedItem.price.bits > 0 && (
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{selectedItem.price.bits.toLocaleString()}</span>
                        <span className="text-slate-300">Bits</span>
                      </div>
                    )}
                    {selectedItem.price.bytes > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-bold">{selectedItem.price.bytes}</span>
                        <span className="text-slate-300">Bytes</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedItem.duration && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Duration</h3>
                    <p className="text-cyan-400">{selectedItem.duration}</p>
                  </div>
                )}
                
                {selectedItem.permanent && (
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Permanent Upgrade</h3>
                    <p className="text-white">This upgrade will be yours forever!</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="border-slate-600 text-slate-300" 
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className={`${
                      canAfford(selectedItem.price) 
                        ? 'bg-cyan-600 hover:bg-cyan-700' 
                        : 'bg-slate-600 cursor-not-allowed'
                    } text-white`}
                    onClick={() => handlePurchase(selectedItem)}
                    disabled={!canAfford(selectedItem.price)}
                  >
                    {canAfford(selectedItem.price) ? 'Purchase' : 'Insufficient Funds'}
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
