import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"

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
    // console.log("results", results);

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
        }, 1500);  // Adjust debounce delay as needed (500ms is standard)

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

    return (
        <Card className="flex flex-row gap-3 p-4 rounded-2xl transition duration-300">
            {/* <Command className="flex-1">
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search stocks, companies..."
                />
                <CommandList>
                    {loading && <CommandEmpty>Loading...</CommandEmpty>}
                    {results.length === 0 && !loading && <CommandEmpty>No results found.</CommandEmpty>}
                    <CommandGroup heading="Stocks">
                        {results.map((stock, index) => {
                            console.log("Rendering stock:", stock); // Log each stock item to confirm rendering
                            return (
                                <CommandItem
                                    key={index}
                                    onSelect={() => console.log(`Selected ${stock["2. name"]}`)}
                                >
                                    <div className="flex justify-between w-full">
                                        <div>
                                            <p className="font-bold">{stock["2. name"]}</p>
                                            <p className="text-sm text-gray-500">{stock["1. symbol"]} - {stock["4. region"]}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{stock["8. currency"]}</p>
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command> */}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[300px] justify-between">
                        {value || "Search stocks, companies..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search stocks, companies..."
                        />
                        <CommandList>
                            {loading && <CommandEmpty>Loading...</CommandEmpty>}
                            {results.length === 0 && !loading && <CommandEmpty>No results found.</CommandEmpty>}
                            <CommandGroup heading="Stocks">
                                {results.map((stock, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            setValue(stock["2. name"]);
                                            setOpen(false);
                                            console.log(`Selected ${stock["2. name"]}`);
                                        }}
                                    >
                                        <div className="flex justify-between w-full">
                                            <div>
                                                <p className="font-bold">{stock["2. name"]}</p>
                                                <p className="text-sm text-gray-500">{stock["1. symbol"]} - {stock["4. region"]}</p>
                                            </div>
                                            {/* <p className="text-sm text-gray-500">{stock["8. currency"]}</p> */}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

        </Card>
    );
}
