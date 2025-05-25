
import React from 'react';
import { Badge } from '@/components/ui/badge';

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
  // Always use standard rewards based on difficulty for consistency
  const rewards = getStandardRewardsByDifficulty(difficulty);

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-yellow-500/10">
        {rewards.xp} XP
      </Badge>
      <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">
        {rewards.bits} Bits
      </Badge>
      <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10">
        {rewards.bytes} Bytes
      </Badge>
    </div>
  );
};

export default ProjectRewards;
