"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResponsiveTabSelectorProps {
  items: { value: string; label: string }[]
  selectedValue: string
  onValueChange: (value: string) => void
  className?: string
  listClassName?: string // For TabsList specific styling
  triggerClassName?: string // For TabsTrigger specific styling
}

export default function ResponsiveTabSelector({
  items,
  selectedValue,
  onValueChange,
  className,
  listClassName,
  triggerClassName,
}: ResponsiveTabSelectorProps) {
  // To make it always a dropdown, we remove the conditional rendering based on isMobile.
  // We will always render the Select component.
  return (
    <div className={className}>
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] bg-neobrutal-card text-neobrutal-text">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-neobrutal-card border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333]">
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="data-[state=checked]:bg-neobrutal-softBlue data-[state=checked]:text-neobrutal-softBlueText hover:bg-neobrutal-softBlue/20 hover:text-neobrutal-softBlueText"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
