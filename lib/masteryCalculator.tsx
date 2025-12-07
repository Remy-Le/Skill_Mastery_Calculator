// Pure calculation logic for Mastery Calculator

export const MASTERY_HOURS = 10000

export interface LifestyleParams {
  sleep: number
  eating: number
  shower: number
  goingOut: number
  travel: number
}

export function getAvailableHours(params: LifestyleParams): number {
  const totalOtherActivities =
    params.sleep + params.eating + params.shower + params.goingOut + params.travel
  return Math.max(0, 24 - totalOtherActivities)
}

export function clampDailyPractice(dailyPractice: number, availableHours: number): number {
  return Math.max(0, Math.min(dailyPractice, availableHours))
}

export function calculateTimeToMastery(
  currentLevel: number,
  dailyPractice: number
): { years: number; months: number; days: number; daysToMastery: number } {
  const remainingHours = Math.max(0, MASTERY_HOURS - currentLevel)
  const daysToMastery = dailyPractice > 0 ? Math.ceil(remainingHours / dailyPractice) : 0
  const years = Math.floor(daysToMastery / 365)
  const remainingDays = daysToMastery % 365
  const months = Math.floor(remainingDays / 30)
  const days = remainingDays % 30
  return { years, months, days, daysToMastery }
}

export function generateChartData(
  currentLevel: number,
  dailyPractice: number,
  daysToMastery: number
) {
  const data = []
  const MAX_YEARS_DISPLAY = 28
  const displayYears = dailyPractice > 0 ? Math.min(Math.ceil(daysToMastery / 365), MAX_YEARS_DISPLAY) : MAX_YEARS_DISPLAY

  let userAccumulatedHours = currentLevel
  const userHoursPerYear = dailyPractice * 365

  let defaultAccumulatedHours = 0
  const defaultHoursPerYear = 0.5 * 365 // 0.5 hours per day for default

  for (let i = 0; i <= displayYears; i++) {
    data.push({
      time: `Year ${i}`,
      "Your Projection": Math.min(MASTERY_HOURS, Math.floor(userAccumulatedHours)),
      "What most people do": Math.min(MASTERY_HOURS, Math.floor(defaultAccumulatedHours)),
    })
    userAccumulatedHours += userHoursPerYear
    defaultAccumulatedHours += defaultHoursPerYear
  }

  return data
}
