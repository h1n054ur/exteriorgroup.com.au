/**
 * LeadForm Component
 * 
 * Modernized inquiry form with:
 * - Floating labels
 * - Real-time HTMX validation
 * - Turnstile spam protection
 * - Design system styling
 */

import type { FC } from 'hono/jsx';

interface LeadFormProps {
  turnstileSiteKey?: string;
  prefilledService?: string;
  prefilledSector?: string;
}

export const LeadForm: FC<LeadFormProps> = ({ 
  turnstileSiteKey,
  prefilledService,
  prefilledSector 
}) => {
  return (
    <div class="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
      {/* Decorative accent */}
      <div class="absolute top-0 left-0 w-2 h-full bg-brand-500"></div>

      <form 
        id="lead-capture-form"
        hx-post="/api/leads/submit"
        hx-target="#form-response-container"
        hx-swap="innerHTML"
        hx-indicator="#form-loading"
        class="space-y-6"
      >
        <div id="form-response-container">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              label="Your Name"
              type="text"
              required
              autocomplete="name"
              placeholder=" "
            />
            <FormField
              name="email"
              label="Email Address"
              type="email"
              required
              autocomplete="email"
              placeholder=" "
              validateEndpoint="/api/leads/validate"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              name="phone"
              label="Phone Number"
              type="tel"
              autocomplete="tel"
              placeholder=" "
              validateEndpoint="/api/leads/validate"
            />
            <FormField
              name="company"
              label="Company / Property"
              type="text"
              autocomplete="organization"
              placeholder=" "
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="form-group">
              <select
                name="serviceType"
                class="form-input form-select"
              >
                <option value="general" selected={!prefilledService}>General Inquiry</option>
                <option value="window" selected={prefilledService === 'window'}>Window Cleaning</option>
                <option value="gutter" selected={prefilledService === 'gutter'}>Gutter Cleaning</option>
                <option value="washing" selected={prefilledService === 'washing'}>House/Building Wash</option>
                <option value="pressure" selected={prefilledService === 'pressure'}>Pressure Washing</option>
                <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
                <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
              </select>
              <label class="form-label !translate-y-[-2.25rem] !scale-[0.85] !text-brand-500 !bg-white !px-2">Service Type</label>
            </div>

            <div class="form-group">
              <select
                name="sector"
                class="form-input form-select"
              >
                <option value="residential" selected={prefilledSector !== 'commercial'}>Residential</option>
                <option value="commercial" selected={prefilledSector === 'commercial'}>Commercial / Strata</option>
              </select>
              <label class="form-label !translate-y-[-2.25rem] !scale-[0.85] !text-brand-500 !bg-white !px-2">Property Type</label>
            </div>
          </div>

          <div class="form-group mt-6">
            <textarea
              name="message"
              rows={4}
              class="form-input"
              placeholder=" "
            ></textarea>
            <label class="form-label">Tell us about your project</label>
          </div>

          {/* Turnstile widget */}
          {turnstileSiteKey && (
            <div class="mt-6">
              <div 
                class="cf-turnstile" 
                data-sitekey={turnstileSiteKey}
              />
              <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
            </div>
          )}

          <div class="mt-8">
            <button
              type="submit"
              class="btn-primary w-full py-4 text-xl flex items-center justify-center gap-3"
            >
              <span>Get Your Free Quote</span>
              <div id="form-loading" class="htmx-indicator">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </button>
          </div>

          <div class="mt-6 text-center text-slate-400 text-sm">
            <p class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              Your information is secure and private
            </p>
          </div>
        </div>
      </form>

      {/* Hidden UTM fields */}
      <input type="hidden" name="utmSource" id="utm_source" />
      <input type="hidden" name="utmMedium" id="utm_medium" />
      <input type="hidden" name="utmCampaign" id="utm_campaign" />
      <input type="hidden" name="landingPage" id="landing_page" />
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const params = new URLSearchParams(window.location.search);
          document.getElementById('utm_source').value = params.get('utm_source') || '';
          document.getElementById('utm_medium').value = params.get('utm_medium') || '';
          document.getElementById('utm_campaign').value = params.get('utm_campaign') || '';
          document.getElementById('landing_page').value = window.location.pathname;
        })();
      `}} />
    </div>
  );
};

const FormField: FC<{
  name: string;
  label: string;
  type: string;
  required?: boolean;
  autocomplete?: string;
  placeholder?: string;
  validateEndpoint?: string;
}> = ({ name, label, type, required, autocomplete, placeholder, validateEndpoint }) => {
  const htmxAttrs = validateEndpoint ? {
    'hx-post': validateEndpoint,
    'hx-trigger': 'blur',
    'hx-target': `next .form-error`,
    'hx-swap': 'innerHTML',
  } : {};

  return (
    <div class="form-group">
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
        class="form-input"
        {...htmxAttrs}
      />
      <label for={name} class="form-label">
        {label} {required && '*'}
      </label>
      <div class="form-error"></div>
    </div>
  );
};

export default LeadForm;
