"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ParameterSlider } from "@/components/parameter-slider"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

import {
  MASTERY_HOURS,
  LifestyleParams,
  getAvailableHours,
  clampDailyPractice,
  calculateTimeToMastery,
  generateChartData,
} from "@/lib/masteryCalculator"
const DEFAULT_PARAMS: LifestyleParams = {
  sleep: 8,
  eating: 2,
  shower: 0.5,
  goingOut: 0,
  travel: 1,
}

export function MasteryCalculator() {
  const [skillName, setSkillName] = useState("")
  const [currentLevel, setCurrentLevel] = useState(0)
  const [dailyPractice, setDailyPractice] = useState(1)
  const [showParameters, setShowParameters] = useState(false)
  const [params, setParams] = useState<LifestyleParams>(DEFAULT_PARAMS)

  // Derived values using pure functions
  const totalOtherActivities = params.sleep + params.eating + params.shower + params.goingOut + params.travel
  const availableHours = getAvailableHours(params)

  // Clamp dailyPractice if params change
  useEffect(() => {
    setDailyPractice((prev) => clampDailyPractice(prev, availableHours))
  }, [availableHours])

  const practiceValue = dailyPractice.toFixed(2)
  const hoursPerWeek = (dailyPractice * 7).toFixed(1)

  const { years, months, days, daysToMastery } = calculateTimeToMastery(currentLevel, dailyPractice)
  const chartData = generateChartData(currentLevel, dailyPractice, daysToMastery)

  const handleParameterChange = (key: keyof LifestyleParams, value: number) => {
    setParams((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(24, value)),
    }))
  }
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column: Inputs */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">Mastery Calculator</CardTitle>
              <CardDescription>Estimate how long it takes to reach 10,000 hours of mastery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Skill Input */}
              <div className="space-y-2">
                <Label htmlFor="skill" className="text-base font-medium">
                  Skill you want to master
                </Label>
                <Input
                  id="skill"
                  placeholder="e.g., Guitar, Programming, Writing..."
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">Optional: Used for display in results</p>
              </div>

              {/* Current Level Input */}
              <div className="space-y-2">
                <Label htmlFor="current-level" className="text-base font-medium">
                  Current hours practiced
                </Label>
                <Input
                  id="current-level"
                  type="number"
                  placeholder="e.g., 100"
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(Number(e.target.value) || 0)}
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">Enter hours you've already practiced.</p>
              </div>

              {/* Daily Practice Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <Label htmlFor="daily-practice" className="text-base font-medium">
                    Daily practice hours
                  </Label>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{practiceValue}</div>
                    <div className="text-sm text-muted-foreground">{hoursPerWeek} hours per week</div>
                  </div>
                </div>

                <Slider
                  id="daily-practice"
                  min={0}
                  max={availableHours}
                  step={0.25}
                  value={[dailyPractice]}
                  onValueChange={(value) => setDailyPractice(value[0])}
                  className="w-full"
                />

                {dailyPractice === 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to practice at least some hours per day to reach mastery.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Show/Hide Parameters Button */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowParameters(!showParameters)}
                  className="w-full justify-between"
                >
                  <span>{showParameters ? "Hide" : "Show"} additional parameters</span>
                  {showParameters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {/* Lifestyle Parameters */}
              {showParameters && (
                <div className="space-y-6 p-4 bg-muted rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                  <h3 className="font-semibold text-base">Lifestyle Parameters</h3>

                  <ParameterSlider
                    id="sleep"
                    label="Sleep"
                    value={params.sleep}
                    min={0}
                    max={12}
                    step={0.5}
                    valueDisplay={(v) => `${v.toFixed(1)}h`}
                    onChange={(v) => handleParameterChange("sleep", v)}
                  />
                  <ParameterSlider
                    id="eating"
                    label="Eating"
                    value={params.eating}
                    min={0}
                    max={6}
                    step={0.25}
                    valueDisplay={(v) => `${v.toFixed(1)}h`}
                    onChange={(v) => handleParameterChange("eating", v)}
                  />
                  <ParameterSlider
                    id="shower"
                    label="Shower"
                    value={params.shower}
                    min={0}
                    max={2}
                    step={0.25}
                    valueDisplay={(v) => `${v.toFixed(2)}h`}
                    onChange={(v) => handleParameterChange("shower", v)}
                  />
                  <ParameterSlider
                    id="going-out"
                    label="Going out / Social time"
                    value={params.goingOut}
                    min={0}
                    max={8}
                    step={0.25}
                    valueDisplay={(v) => `${v.toFixed(1)}h`}
                    onChange={(v) => handleParameterChange("goingOut", v)}
                  />
                  <ParameterSlider
                    id="travel"
                    label="Travel time"
                    value={params.travel}
                    min={0}
                    max={8}
                    step={0.25}
                    valueDisplay={(v) => `${v.toFixed(1)}h`}
                    onChange={(v) => handleParameterChange("travel", v)}
                  />

                  {/* Summary */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Other activities:</span>
                      <span className="font-semibold">{totalOtherActivities.toFixed(1)} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available for practice:</span>
                      <span
                        className={`font-semibold ${
                          availableHours < dailyPractice ? "text-destructive" : "text-primary"
                        }`}
                      >
                        {availableHours.toFixed(1)} hours
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="sticky top-8 h-min space-y-4 min-w-[420px] max-w-[600px] w-full">
          {dailyPractice > 0 && (
            <div className="p-6 bg-primary text-primary-foreground rounded-lg space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <p className="text-lg font-semibold mb-2">Time to reach 10,000 hours</p>
                <p className="text-4xl font-bold mb-4">
                  {years > 0 ? `${years}y ${months}m ${days}d` : months > 0 ? `${months}m ${days}d` : `${days}d`}
                </p>
                <p className="text-sm opacity-90 leading-relaxed">
                  {skillName
                    ? `With ${dailyPractice} hours of daily practice on ${skillName}, y`
                    : `With ${dailyPractice} hours of daily practice, y`}
                  ou will reach 10,000 hours in approximately{" "}
                  <strong>
                    {years > 0
                      ? `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}, and ${days} day${
                          days !== 1 ? "s" : ""
                        }`
                      : months > 0
                      ? `${months} month${months > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""}`
                      : `${days} day${days !== 1 ? "s" : ""}`}
                  </strong>
                  .
                </p>
              </div>

              {showParameters && (
                <div className="pt-4 border-t border-primary-foreground/20 space-y-2 text-sm opacity-90">
                  <p>
                    Out of 24 hours, you spend <strong>{totalOtherActivities.toFixed(1)} hours</strong> on other
                    activities and have <strong>{availableHours.toFixed(1)} hours</strong> available for practice.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-primary-foreground/20 text-xs opacity-75">
                <p>
                  <strong>Note:</strong> This is a simplified model assuming consistent daily practice with no breaks.
                  {/*Actual time may vary based on learning efficiency, breaks, and life circumstances. */}
                </p>
              </div>
            </div>
          )}

          {/* Progress Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Projected Progress to 10,000 Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 10000]} tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Your Projection"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="What most people do"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
