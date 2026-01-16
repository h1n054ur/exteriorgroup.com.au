/**
 * LeadForm Component
 * 
 * Modernized inquiry form with dark glassmorphism design:
 * - Dark background with subtle borders
 * - Violet accent colors
 * - Real-time HTMX validation
 * - Turnstile spam protection
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
    <section id="contact" class="py-20">
      <div class="container">
        <div class="section-head mb-12">
          <div class="max-w-2xl">
            <div class="kicker mb-2">Get started</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Request a free quote</h2>
            <p class="text-muted leading-relaxed">Tell us about your property and we'll get back to you within 24 hours with a no-obligation estimate.</p>
          </div>
        </div>

        <div class="card p-8 md:p-10 reveal border border-white/15 bg-white/5 max-w-3xl">
          <form 
            id="lead-capture-form"
            hx-post="/api/leads/submit"
            hx-target="#form-response-container"
            hx-swap="innerHTML"
            hx-indicator="#form-loading"
            class="space-y-6"
          >
            <div id="form-response-container">
              {/* Name & Email row */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="field">
                  <label for="name">Your name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    autocomplete="name"
                    placeholder="Jane Smith"
                  />
                </div>
                <div class="field">
                  <label for="email">Email address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    autocomplete="email"
                    placeholder="jane@example.com"
                    hx-post="/api/leads/validate"
                    hx-trigger="blur"
                    hx-target="next .field-error"
                    hx-swap="innerHTML"
                  />
                  <div class="field-error text-sm text-red-400 mt-1"></div>
                </div>
              </div>

              {/* Phone & Company row */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div class="field">
                  <label for="phone">Phone number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    autocomplete="tel"
                    placeholder="0400 000 000"
                    hx-post="/api/leads/validate"
                    hx-trigger="blur"
                    hx-target="next .field-error"
                    hx-swap="innerHTML"
                  />
                  <div class="field-error text-sm text-red-400 mt-1"></div>
                </div>
                <div class="field">
                  <label for="company">Company / Property name</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    autocomplete="organization"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Service & Sector row */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div class="field">
                  <label for="serviceType">Service type</label>
                  <select name="serviceType" id="serviceType">
                    <option value="general" selected={!prefilledService}>General Inquiry</option>
                    <option value="window" selected={prefilledService === 'window'}>Window Cleaning</option>
                    <option value="gutter" selected={prefilledService === 'gutter'}>Gutter Cleaning</option>
                    <option value="washing" selected={prefilledService === 'washing'}>House/Building Wash</option>
                    <option value="pressure" selected={prefilledService === 'pressure'}>Pressure Washing</option>
                    <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
                    <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
                  </select>
                </div>
                <div class="field">
                  <label for="sector">Property type</label>
                  <select name="sector" id="sector">
                    <option value="residential" selected={prefilledSector !== 'commercial'}>Residential</option>
                    <option value="commercial" selected={prefilledSector === 'commercial'}>Commercial / Strata</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div class="field mt-5">
                <label for="message">Tell us about your project</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4}
                  placeholder="Briefly describe what you need – photos can be attached later."
                ></textarea>
              </div>

              {/* Turnstile widget */}
              {turnstileSiteKey && (
                <div class="mt-6">
                  <div 
                    class="cf-turnstile" 
                    data-sitekey={turnstileSiteKey}
                    data-theme="dark"
                  />
                  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
                </div>
              )}

              {/* Submit */}
              <div class="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button type="submit" class="btn primary py-3.5 px-8 text-base w-full sm:w-auto">
                  <span>Get your free quote</span>
                  <div id="form-loading" class="htmx-indicator">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M9 7h8v8"/>
                  </svg>
                </button>
                
                <p class="text-muted2 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 text-accent2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  Your info stays private
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
      </div>
    </section>
  );
};

// Standalone form for /enquire page (without section wrapper)
export const LeadFormStandalone: FC<LeadFormProps> = ({ 
  turnstileSiteKey,
  prefilledService,
  prefilledSector 
}) => {
  return (
    <div class="card p-8 md:p-10 reveal border border-white/15 bg-white/5">
      <form 
        id="lead-capture-form"
        hx-post="/api/leads/submit"
        hx-target="#form-response-container"
        hx-swap="innerHTML"
        hx-indicator="#form-loading"
        class="space-y-6"
      >
        <div id="form-response-container">
          {/* Name & Email row */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="field">
              <label for="name">Your name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                autocomplete="name"
                placeholder="Jane Smith"
              />
            </div>
            <div class="field">
              <label for="email">Email address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                autocomplete="email"
                placeholder="jane@example.com"
                hx-post="/api/leads/validate"
                hx-trigger="blur"
                hx-target="next .field-error"
                hx-swap="innerHTML"
              />
              <div class="field-error text-sm text-red-400 mt-1"></div>
            </div>
          </div>

          {/* Phone & Company row */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div class="field">
              <label for="phone">Phone number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                autocomplete="tel"
                placeholder="0400 000 000"
                hx-post="/api/leads/validate"
                hx-trigger="blur"
                hx-target="next .field-error"
                hx-swap="innerHTML"
              />
              <div class="field-error text-sm text-red-400 mt-1"></div>
            </div>
            <div class="field">
              <label for="company">Company / Property name</label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                autocomplete="organization"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Service & Sector row */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div class="field">
              <label for="serviceType">Service type</label>
              <select name="serviceType" id="serviceType">
                <option value="general" selected={!prefilledService}>General Inquiry</option>
                <option value="window" selected={prefilledService === 'window'}>Window Cleaning</option>
                <option value="gutter" selected={prefilledService === 'gutter'}>Gutter Cleaning</option>
                <option value="washing" selected={prefilledService === 'washing'}>House/Building Wash</option>
                <option value="pressure" selected={prefilledService === 'pressure'}>Pressure Washing</option>
                <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
                <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
              </select>
            </div>
            <div class="field">
              <label for="sector">Property type</label>
              <select name="sector" id="sector">
                <option value="residential" selected={prefilledSector !== 'commercial'}>Residential</option>
                <option value="commercial" selected={prefilledSector === 'commercial'}>Commercial / Strata</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div class="field mt-5">
            <label for="message">Tell us about your project</label>
            <textarea 
              id="message" 
              name="message" 
              rows={4}
              placeholder="Briefly describe what you need – photos can be attached later."
            ></textarea>
          </div>

          {/* Turnstile widget */}
          {turnstileSiteKey && (
            <div class="mt-6">
              <div 
                class="cf-turnstile" 
                data-sitekey={turnstileSiteKey}
                data-theme="dark"
              />
              <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
            </div>
          )}

          {/* Submit */}
          <div class="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button type="submit" class="btn primary py-3.5 px-8 text-base w-full sm:w-auto">
              <span>Get your free quote</span>
              <div id="form-loading" class="htmx-indicator">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7M9 7h8v8"/>
              </svg>
            </button>
            
            <p class="text-muted2 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-accent2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              Your info stays private
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

export default LeadForm;
