import { SipCalculator } from "@/components/sip-calculator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      {/* <h1 className="text-3xl font-bold text-center mb-8">SIP Investment Calculator</h1> */}
      <h2 className="text-center scroll-m-20 pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
        <span className="border-b">
          SIP Investment Calculator
        </span>
      </h2>
      <div className="">
      </div>
      <div className="max-w-6xl mx-auto">
        <SipCalculator />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <MarketStatusComponent /> */}
      </div>
    </main>
  )
}

