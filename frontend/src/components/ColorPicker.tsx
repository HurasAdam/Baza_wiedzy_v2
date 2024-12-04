import React, { useEffect } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"


type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
  items?: Item[]
}

type Item = {
    value: string;
    label: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({value, onChange, items}) => {
  const [color, setColor] = React.useState(value)
  const [isOpen, setIsOpen] = React.useState(false)
  useEffect(() => {
    setColor(value)
  }, [value])


  const handleColorChange = (color: string) => {
    onChange && onChange(color)
    setColor(color)
    setIsOpen(false) // Zamknij Popover po wyborze koloru
  }


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-transparent hover:bg-white/10">
          <div
            style={{ backgroundColor: color }}
            className="w-7 h-7 rounded-md mr-2 border border-white/10"
          ></div>
          <p>{color}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        {items && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <button
                onClick={() => handleColorChange(item.value)}
                key={index}
                className="w-7 h-7 rounded-md aspect-square border"
                style={{ backgroundColor: item.value }}
              ></button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}