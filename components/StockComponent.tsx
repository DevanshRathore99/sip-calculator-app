import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

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
    console.log(query,'Queryyyyyyy');
    
    const [results, setResults] = useState<StockResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);
        setError(null);

        try {
            console.log(CountQueuingStrategy,'WQQQQWQWQWQWQW');
            
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
        <div>
            <Card className="flex flex-row gap-3 p-4 rounded-2xl transition duration-300 hover:shadow-xl">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search stocks, companies..."
                    className="flex border-0 focus:ring-0 focus:border-blue-500 text-gray-700 bg-gray-100 rounded-md"
                />
                <Button
                    variant="outline"
                    className="p-2 hover:bg-blue-500 hover:text-white transition duration-300"
                    onClick={handleSearch}
                    // disabled={loading}
                >
                    <Search size={20} />
                </Button>
            </Card>

            {loading && <div className="mt-4">Loading...</div>}
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {results.length > 0 && (
                <div className="mt-4">
                    {results.map((stock) => (
                        <Card key={stock["1. symbol"]} className="p-4 mb-2 rounded-2xl shadow-sm">
                            <h2 className="text-lg font-bold">{stock["2. name"]}</h2>
                            <p><strong>Symbol:</strong> {stock["1. symbol"]}</p>
                            <p><strong>Region:</strong> {stock["4. region"]}</p>
                            <p><strong>Currency:</strong> {stock["8. currency"]}</p>
                            <p><strong>Market Open:</strong> {stock["5. marketOpen"]}</p>
                            <p><strong>Market Close:</strong> {stock["6. marketClose"]}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
