import { SipCalculator } from "@/components/sip-calculator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">SIP Investment Calculator</h1>
      <div className="">
      </div>
      <div className="max-w-4xl mx-auto">
       
        <SipCalculator />
      </div>
    </main>
  )
}

