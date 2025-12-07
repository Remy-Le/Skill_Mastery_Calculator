import { MasteryCalculator } from "@/components/mastery-calculator"

export const metadata = {
  title: "Mastery Calculator - 10,000 Hour Rule",
  description: "Estimate how long it will take to reach mastery (10,000 hours) for any skill",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex items-start justify-center">
      <MasteryCalculator />
    </main>
  )
}
