"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Label as RechartsLabel } from "recharts"
import { Calculator } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ThemeToggle } from "./ThemeToggle"

export function SipCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
    const [annualReturnRate, setAnnualReturnRate] = useState(12)
    const [timePeriod, setTimePeriod] = useState(10)
    // const [chartData, setChartData] = useState<any[]>([])
    const [totalInvestment, setTotalInvestment] = useState(0)
    const [estimatedReturns, setEstimatedReturns] = useState(0)
    const [totalValue, setTotalValue] = useState(0)

    useEffect(() => {
        calculateSIP()
    }, [monthlyInvestment, annualReturnRate, timePeriod])

    const calculateSIP = () => {
        const monthlyRate = annualReturnRate / 12 / 100
        const months = timePeriod * 12
        const investedAmount = monthlyInvestment * months

        let futureValue = 0
        const data = []

        for (let i = 1; i <= months; i++) {
            // SIP future value formula: P × ((1 + r)^n - 1) / r × (1 + r)
            futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) * (1 + monthlyRate)

            if (i % 12 === 0) {
                const year = i / 12
                data.push({
                    year: `Year ${year}`,
                    investment: monthlyInvestment * i,
                    value: Math.round(futureValue),
                })
            }
        }

        // setChartData(data)
        setTotalInvestment(investedAmount)
        setEstimatedReturns(Math.round(futureValue - investedAmount))
        setTotalValue(Math.round(futureValue))
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        SIP Calculator
                    </div>
                    <ThemeToggle />
                </CardTitle>
                <CardDescription>Calculate the future value of your Systematic Investment Plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="monthlyInvestment">Monthly Investment</Label>
                                <span className="text-sm font-medium">{formatCurrency(monthlyInvestment)}</span>
                            </div>
                            <Input
                                id="monthlyInvestment"
                                type="number"
                                value={monthlyInvestment}
                                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                min={500}
                                max={100000}
                            />
                            <Slider
                                value={[monthlyInvestment]}
                                min={500}
                                max={100000}
                                step={500}
                                onValueChange={(value) => setMonthlyInvestment(value[0])}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="annualReturnRate">Expected Return Rate (%)</Label>
                                <span className="text-sm font-medium">{annualReturnRate}%</span>
                            </div>
                            <Input
                                id="annualReturnRate"
                                type="number"
                                value={annualReturnRate}
                                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                                min={1}
                                max={30}
                            />
                            <Slider
                                value={[annualReturnRate]}
                                min={1}
                                max={30}
                                step={0.5}
                                onValueChange={(value) => setAnnualReturnRate(value[0])}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="timePeriod">Time Period (Years)</Label>
                                <span className="text-sm font-medium">{timePeriod} years</span>
                            </div>
                            <Input
                                id="timePeriod"
                                type="number"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(Number(e.target.value))}
                                min={1}
                                max={30}
                            />
                            <Slider
                                value={[timePeriod]}
                                min={1}
                                max={30}
                                step={1}
                                onValueChange={(value) => setTimePeriod(value[0])}
                                className="py-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-4">
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-medium mb-4">Investment Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Investment</span>
                                    <span className="font-medium">{formatCurrency(totalInvestment)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estimated Returns</span>
                                    <span className="font-medium text-green-600">{formatCurrency(estimatedReturns)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Value</span>
                                        <span className="font-bold">{formatCurrency(totalValue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[350px] mt-8">
                    <h3 className="text-lg font-medium mb-4">Investment Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ChartContainer
                            config={{
                                investment: {
                                    label: "Principal",
                                    color: "hsl(var(--chart-1))",
                                },
                                returns: {
                                    label: "Returns",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="aspect-square max-h-[300px] mx-auto"
                        >
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={[
                                        { name: "Principal", value: totalInvestment, fill: "var(--color-investment)" },
                                        { name: "Returns", value: estimatedReturns, fill: "var(--color-returns)" },
                                    ]}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    strokeWidth={4}
                                >
                                    <RechartsLabel
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan x={viewBox.cx} className="fill-foreground text-lg font-bold">
                                                            {formatCurrency(totalValue)}
                                                        </tspan>
                                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground text-xs">
                                                            Total Value
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
                                    <span className="text-sm">Principal Investment</span>
                                    <span className="ml-auto font-medium">{formatCurrency(totalInvestment)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({Math.round((totalInvestment / totalValue) * 100)}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
                                    <span className="text-sm">Estimated Returns</span>
                                    <span className="ml-auto font-medium">{formatCurrency(estimatedReturns)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({Math.round((estimatedReturns / totalValue) * 100)}%)
                                    </span>
                                </div>
                                <div className="pt-3 border-t mt-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Total Value</span>
                                        <span className="ml-auto font-bold">{formatCurrency(totalValue)}</span>
                                        <span className="text-sm text-muted-foreground">(100%)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground mt-4">
                                <p>
                                    Monthly SIP of {formatCurrency(monthlyInvestment)} for {timePeriod} years at {annualReturnRate}%
                                    annual returns.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                <p>
                    Note: The projected values are based on the assumption that the return rate remains constant throughout the
                    investment period. Actual returns may vary.
                </p>
            </CardFooter>
        </Card>
    )
}

