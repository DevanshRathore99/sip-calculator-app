import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { PuffLoader } from "react-spinners";
import Image from "next/image";
import Link from "next/link";

interface StockResult {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
}

export default function StockComponent() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<StockResult[]>([]);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [stockDetails, setStockDetails] = useState<any>(null);
    const [news, setNews] = useState<any>(null);
    // console.log(news, 'NNNNNNNNNNNNNNNNNnn');


    const [stockLoading, setStockLoading] = useState(false);
    // console.log("results@@@@@@@@@", stockDetails);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setError(null);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 1000);  // Adjust debounce delay as needed (500ms is standard)

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/stock?query=${query}`);

            if (!response.ok) {
                throw new Error("Failed to fetch stock data");
            }

            const data = await response.json();

            if (data.bestMatches) {
                setResults(data.bestMatches);
                setOpen(false); // Temporarily close the Popover
                setOpen(true) // Reopen it immediately
            } else {
                setError("No results found.");
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    async function fetchStockDetails(symbol: string) {
        setStockLoading(true);
        try {
            const response = await fetch(`/api/individualStock?query=${symbol}`);

            if (!response.ok) {
                throw new Error("Failed to fetch stock details");
            }

            const stockDetails = await response.json();
            // console.log("Stock Details:", stockDetails);

            setStockDetails(stockDetails);
        } catch (error) {
            console.error("Error fetching stock details:", error);
            return null;
        }
        finally {
            setStockLoading(false);
        }
    }

    async function fetchStockNews(symbol: string) {
        try {
            const response = await fetch(`/api/stockNews?query=${symbol}`);

            if (!response.ok) {
                throw new Error("Failed to fetch stock news");
            }

            const news = await response.json();
            // console.log("Stock News:", news);

            setNews(news.feed[0]);
        } catch (error) {
            console.error("Error fetching stock news:", error);
            return null;
        }
    }


    return (
        <>
            <div>
                <Card className="flex flex-col gap-4 p-4 transition duration-300 w-full rounded-2xl shadow-lg">
                    {/* Stock Search and Details Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center gap-3">
                            <Popover key={results.length} open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="justify-between w-[300px]"
                                    >
                                        {value || "Search stocks, companies..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[300px]">
                                    <Command>
                                        <CommandInput
                                            value={query}
                                            onValueChange={setQuery}
                                            placeholder="Search stocks, companies..."
                                        />
                                        <CommandList>
                                            {loading && <CommandEmpty>Loading...</CommandEmpty>}
                                            {results.length === 0 && !loading && <CommandEmpty>No results found.</CommandEmpty>}
                                            <CommandGroup heading={results.length > 0 ? `Stocks` : ``}>
                                                {results?.map((stock, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        onSelect={() => {
                                                            setValue(stock["2. name"]);
                                                            fetchStockDetails(stock["1. symbol"]);
                                                            fetchStockNews(stock["1. symbol"]); // Fetch news here
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <div className="flex justify-between w-full">
                                                            <div>
                                                                <p className="font-bold">{stock["2. name"]}</p>
                                                                <p className="text-sm text-gray-500">{stock["1. symbol"]} - {stock["4. region"]}</p>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Stock Details Display */}
                        {stockDetails && stockDetails["Global Quote"] && (
                            <div className="p-4 rounded-xl border border-gray shadow-md flex flex-col gap-4">
                                {stockLoading ? (
                                    <div className="flex justify-center items-center"><PuffLoader color="#60a8fb" /></div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold mb-2">📊 Stock Details</h2>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <p><strong>Symbol:</strong> {stockDetails["Global Quote"]["01. symbol"]}</p>
                                            <p><strong>Open:</strong> {stockDetails["Global Quote"]["02. open"]}</p>
                                            <p><strong>High:</strong> {stockDetails["Global Quote"]["03. high"]}</p>
                                            <p><strong>Low:</strong> {stockDetails["Global Quote"]["04. low"]}</p>
                                            <p><strong>Price:</strong> {stockDetails["Global Quote"]["05. price"]}</p>
                                            <p><strong>Volume:</strong> {stockDetails["Global Quote"]["06. volume"]}</p>
                                            <p><strong>Latest Trading Day:</strong> {stockDetails["Global Quote"]["07. latest trading day"]}</p>
                                            <p><strong>Previous Close:</strong> {stockDetails["Global Quote"]["08. previous close"]}</p>
                                            <p><strong>Change:</strong> {stockDetails["Global Quote"]["09. change"]}</p>
                                            <p><strong>Change Percent:</strong> {stockDetails["Global Quote"]["10. change percent"]}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* News Section */}
                    {/* News Section */}
                    {news && (
                        <div className="p-4 mt-4 rounded-xl border border-gray-300 shadow-md">
                            <h2 className="text-xl font-bold mb-2">📰 Related News</h2>
                            <div className="overflow-y-auto">
                                {/* {news.map((news: any, index: number) => ( */}
                                <div
                                    // key={index}
                                    className="flex flex-col gap-4 p-2 border-b border-gray-200"
                                >
                                    {/* news Image */}

                                    <div className="flex-1">
                                        {/* news Title */}
                                        <Link
                                            href={news.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 font-semibold hover:underline"
                                        >
                                            {news.title}
                                        </Link>

                                        {/* news Summary */}
                                        <p className="text-sm text-gray-600 mt-1">
                                            {news.summary}
                                        </p>

                                        {/* news Metadata */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                            <span>Source: {news.source}</span>
                                            <span>Published: {news.time_published.slice(0, 4)}-{news.time_published.slice(4, 6)}-{news.time_published.slice(6, 8)}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* ))} */}
                            </div>
                        </div>
                    )}

                </Card>
            </div>

        </>

    );
}
