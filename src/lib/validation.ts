/**
 * Validation Utilities
 * 
 * Server-side validation for lead capture forms.
 * Returns validation results for HTMX inline error display.
 */

/**
 * Email validation
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true };
}

/**
 * Phone validation (Australian format)
 */
export function validatePhone(phone: string): { valid: boolean; message?: string } {
  if (!phone || phone.trim() === '') {
    // Phone is optional
    return { valid: true };
  }
  
  // Remove spaces and common separators
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Australian mobile: 04XXXXXXXX or +614XXXXXXXX
  // Australian landline: 0XXXXXXXXX or +61XXXXXXXXX
  const ausPhoneRegex = /^(\+?61|0)[2-478]\d{8}$/;
  
  if (!ausPhoneRegex.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid Australian phone number' };
  }
  
  return { valid: true };
}

/**
 * Name validation
 */
export function validateName(name: string): { valid: boolean; message?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  
  return { valid: true };
}

/**
 * Service type validation
 */
export function validateServiceType(serviceType: string): { valid: boolean; message?: string } {
  const validTypes = ['general', 'roofing', 'painting', 'strata'];
  
  if (!validTypes.includes(serviceType)) {
    return { valid: false, message: 'Please select a valid service type' };
  }
  
  return { valid: true };
}

/**
 * Sector validation
 */
export function validateSector(sector: string): { valid: boolean; message?: string } {
  const validSectors = ['commercial', 'residential'];
  
  if (!validSectors.includes(sector)) {
    return { valid: false, message: 'Please select a valid property type' };
  }
  
  return { valid: true };
}

/**
 * Full form validation
 */
export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  sector: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  turnstileToken?: string;
}

export function validateLeadForm(data: LeadFormData): { 
  valid: boolean; 
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  const nameResult = validateName(data.name);
  if (!nameResult.valid) errors.name = nameResult.message!;
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) errors.email = emailResult.message!;
  
  if (data.phone) {
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.valid) errors.phone = phoneResult.message!;
  }
  
  const serviceResult = validateServiceType(data.serviceType || 'general');
  if (!serviceResult.valid) errors.serviceType = serviceResult.message!;
  
  const sectorResult = validateSector(data.sector || 'residential');
  if (!sectorResult.valid) errors.sector = sectorResult.message!;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Turnstile verification
 */
export async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(ip && { remoteip: ip })
      })
    });
    
    const result = await response.json() as { success: boolean; 'error-codes'?: string[] };
    
    if (!result.success) {
      return { 
        success: false, 
        error: result['error-codes']?.join(', ') || 'Verification failed' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Verification service unavailable' };
  }
}
