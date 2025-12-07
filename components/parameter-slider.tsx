import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import React from "react"

interface ParameterSliderProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  valueDisplay?: (value: number) => string
  onChange: (value: number) => void
}

export function ParameterSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  valueDisplay = (v) => v.toString(),
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-sm font-semibold text-primary">{valueDisplay(value)}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  )
}
