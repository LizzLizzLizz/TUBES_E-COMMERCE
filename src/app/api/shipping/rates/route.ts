import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      destination_postal_code,
      destination_area_id,
      destination_latitude,
      destination_longitude,
      items 
    } = body;

    // Validation - at least one destination parameter is required
    if (
      !destination_postal_code && 
      !destination_area_id && 
      (!destination_latitude || !destination_longitude)
    ) {
      return errorResponse(
        'Destination information required: postal_code, area_id, or coordinates (latitude & longitude)',
        400
      );
    }

    if (!items || items.length === 0) {
      return errorResponse('Items are required', 400);
    }

    // Calculate total weight (assuming each item is 500g, adjust as needed)
    const totalWeight = items.reduce((sum: number, item: any) => sum + (item.quantity * 500), 0);
    const totalValue = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Build Biteship payload using hybrid/mix method
    const biteshipPayload: any = {
      origin_postal_code: 12920, // Jakarta Pusat (adjust to your warehouse location)
      couriers: 'jne,jnt,sicepat,anteraja,ninja', // Popular Indonesian couriers
      items: [
        {
          name: 'Products',
          description: 'E-commerce products',
          value: totalValue,
          weight: totalWeight,
          length: 30,  // Default dimensions in cm
          width: 20,
          height: 15,
          quantity: 1,
        },
      ],
    };

    // Add destination based on what's provided (HYBRID/MIX METHOD)
    // Priority: area_id (most accurate) > postal_code > coordinates
    if (destination_area_id) {
      biteshipPayload.destination_area_id = destination_area_id;
    } else if (destination_postal_code) {
      biteshipPayload.destination_postal_code = parseInt(destination_postal_code);
    } else if (destination_latitude && destination_longitude) {
      biteshipPayload.destination_latitude = parseFloat(destination_latitude);
      biteshipPayload.destination_longitude = parseFloat(destination_longitude);
    }

    const response = await fetch(`${process.env.BITESHIP_BASE_URL}/v1/rates/couriers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.BITESHIP_API_KEY || '',
      },
      body: JSON.stringify(biteshipPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Biteship API error:', errorText);
      return errorResponse(
        'Failed to fetch shipping rates',
        response.status,
        { details: errorText }
      );
    }

    const data = await response.json();
    
    // Return enhanced response with origin and destination info
    return successResponse(
      {
        pricing: data.pricing || [],
        origin: data.origin || null,
        destination: data.destination || null,
      },
      'Shipping rates calculated successfully',
      200
    );
  } catch (error) {
    console.error('Shipping rate error:', error);
    return errorResponse('Failed to calculate shipping rates', 500);
  }
}
