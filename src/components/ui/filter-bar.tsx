import { ReactNode } from 'react';
import { FaSearch as Search, FaTimes as X } from 'react-icons/fa';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onClearFilters?: () => void;
  className?: string;
}

export function FilterBar({
  children,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onClearFilters,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('filter-bar', className)}>
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      )}
      {children}
      {onClearFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="ml-auto text-muted-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
