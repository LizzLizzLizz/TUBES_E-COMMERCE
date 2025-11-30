// Rate limiting implementation for Next.js API routes
// Simple in-memory rate limiter (for production, use Redis)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 15 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
}

export function rateLimit(identifier: string, config: RateLimitConfig): {
  success: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitMap.set(identifier, newEntry);
    return {
      success: true,
      remaining: config.max - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment existing entry
  entry.count++;

  if (entry.count > config.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    success: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}

// Get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
  payment: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 payment attempts per minute
  },
};
