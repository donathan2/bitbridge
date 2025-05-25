
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

interface MultiSelectFilterProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  label: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-between min-w-[180px]"
        >
          <span className="truncate">
            {selectedValues.length === 0 
              ? placeholder 
              : selectedValues.length === 1 
                ? selectedValues[0]
                : `${selectedValues.length} selected`
            }
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-slate-700 border-slate-600">
        <div className="p-3 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-200">{label}</h4>
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-auto p-0 text-slate-400 hover:text-slate-200"
              >
                Clear all
              </Button>
            )}
          </div>
          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedValues.map((value) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="text-xs bg-cyan-600 text-white"
                >
                  {value}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 p-2 hover:bg-slate-600 rounded cursor-pointer"
              onClick={() => handleToggle(option)}
            >
              <Checkbox
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <span className="text-slate-200 text-sm">{option}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFilter;
