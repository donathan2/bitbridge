
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign, Zap } from 'lucide-react';

interface ProjectRewardsProps {
  difficulty: string;
  xpReward?: number;
  bitsReward?: number;
  bytesReward?: number;
}

const getStandardRewardsByDifficulty = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return { xp: 300, bits: 200, bytes: 3 };
    case 'Intermediate':
      return { xp: 600, bits: 400, bytes: 6 };
    case 'Advanced':
      return { xp: 1000, bits: 700, bytes: 12 };
    case 'Expert':
      return { xp: 1500, bits: 1200, bytes: 20 };
    default:
      return { xp: 300, bits: 200, bytes: 3 };
  }
};

const ProjectRewards: React.FC<ProjectRewardsProps> = ({ 
  difficulty, 
  xpReward, 
  bitsReward, 
  bytesReward 
}) => {
  // Use passed rewards if available, otherwise use standard rewards
  const standardRewards = getStandardRewardsByDifficulty(difficulty);
  const rewards = {
    xp: xpReward || standardRewards.xp,
    bits: bitsReward || standardRewards.bits,
    bytes: bytesReward || standardRewards.bytes
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-yellow-500/10 flex items-center gap-1">
        <Star className="w-3 h-3" />
        {rewards.xp} XP
      </Badge>
      <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10 flex items-center gap-1">
        <Zap className="w-3 h-3" />
        {rewards.bits} Bits
      </Badge>
      <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10 flex items-center gap-1">
        <DollarSign className="w-3 h-3" />
        {rewards.bytes} Bytes
      </Badge>
    </div>
  );
};

export default ProjectRewards;
