import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');
    const countries = searchParams.get('countries') || 'ID';
    const type = searchParams.get('type') || 'single';

    if (!input || input.length < 3) {
      return errorResponse('Input must be at least 3 characters', 400);
    }

    const url = `${process.env.BITESHIP_BASE_URL}/v1/maps/areas?countries=${countries}&input=${encodeURIComponent(input)}&type=${type}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: process.env.BITESHIP_API_KEY || '',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Biteship Maps API error:', errorText);
      return errorResponse(
        'Failed to search areas',
        response.status,
        { details: errorText }
      );
    }

    const data = await response.json();
    return successResponse(
      data.areas || [],
      'Areas retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Maps API error:', error);
    return errorResponse('Failed to search areas', 500);
  }
}
