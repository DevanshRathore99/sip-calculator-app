import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Make sure you set this in your .env file
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${query}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch data from Alpha Vantage' }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
