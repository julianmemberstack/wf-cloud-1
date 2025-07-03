import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/mortgagerate', {
      headers: {
        'X-Api-Key': '1g6QZT1jkcykSLmTginVgA==yGbaze1khMi0OoVb',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // API returns an array with current rates in data[0].data
    const currentRates = Array.isArray(data) && data.length > 0 ? data[0].data : null;
    
    return NextResponse.json({
      success: true,
      data: currentRates
    });
  } catch (error) {
    console.error('Error fetching mortgage rates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch mortgage rates' 
      },
      { status: 500 }
    );
  }
} 