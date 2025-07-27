import * as React from "react"
import { cn } from "~/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

// Simple select wrapper that works with the existing API
const Select = ({ value, onValueChange, children, ...props }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  
  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedValue || "Seçiniz"}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white p-1 shadow-md">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.props as any).value) {
              return (
                <div
                  key={(child.props as any).value}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-gray-100"
                  onClick={() => handleSelect((child.props as any).value)}
                >
                  {(child.props as any).children}
                </div>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

const SelectTrigger = ({ children, ...props }: SelectTriggerProps) => (
  <div {...props}>{children}</div>
)

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span>{placeholder}</span>
)

const SelectContent = ({ children }: SelectContentProps) => (
  <>{children}</>
)

const SelectItem = ({ value, children }: SelectItemProps) => (
  <option value={value}>{children}</option>
)

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} 