/**
 * LeadForm Component
 * 
 * Conversational inquiry form with:
 * - Floating labels
 * - Real-time HTMX validation
 * - Turnstile spam protection
 * - Safety Amber CTA styling
 */

import type { FC } from 'hono/jsx';

interface LeadFormProps {
  turnstileSiteKey?: string;
  prefilledService?: string;
  prefilledSector?: string;
}

/**
 * LeadForm - Main inquiry form component
 */
export const LeadForm: FC<LeadFormProps> = ({ 
  turnstileSiteKey,
  prefilledService,
  prefilledSector 
}) => {
  return (
    <form 
      id="lead-capture-form"
      hx-post="/api/leads/submit"
      hx-target="#form-response"
      hx-swap="innerHTML"
      hx-indicator="#form-loading"
      style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}
    >
      {/* Name field */}
      <FormField
        name="name"
        label="Your Name"
        type="text"
        required
        autocomplete="name"
      />

      {/* Email field */}
      <FormField
        name="email"
        label="Email Address"
        type="email"
        required
        autocomplete="email"
        validateEndpoint="/api/leads/validate"
      />

      {/* Phone field */}
      <FormField
        name="phone"
        label="Phone Number"
        type="tel"
        autocomplete="tel"
        placeholder="04XX XXX XXX"
        validateEndpoint="/api/leads/validate"
      />

      {/* Company field */}
      <FormField
        name="company"
        label="Company / Property Name"
        type="text"
        autocomplete="organization"
      />

      {/* Service type dropdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Service Type
        </label>
        <select
          name="serviceType"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            background: 'white'
          }}
        >
          <option value="general" selected={!prefilledService}>General Inquiry</option>
          <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
          <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
          <option value="strata" selected={prefilledService === 'strata'}>Strata Services</option>
        </select>
      </div>

      {/* Sector radio buttons */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Property Type
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}>
            <input 
              type="radio" 
              name="sector" 
              value="commercial" 
              checked={prefilledSector === 'commercial'}
              style={{ accentColor: '#f59e0b' }}
            />
            Commercial
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}>
            <input 
              type="radio" 
              name="sector" 
              value="residential" 
              checked={prefilledSector !== 'commercial'}
              style={{ accentColor: '#f59e0b' }}
            />
            Residential
          </label>
        </div>
      </div>

      {/* Message textarea */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Tell us about your project
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Describe your project, timeline, or any specific requirements..."
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            resize: 'vertical',
            minHeight: '100px'
          }}
        />
      </div>

      {/* UTM hidden fields */}
      <input type="hidden" name="utmSource" id="utm_source" />
      <input type="hidden" name="utmMedium" id="utm_medium" />
      <input type="hidden" name="utmCampaign" id="utm_campaign" />
      <input type="hidden" name="landingPage" id="landing_page" />

      {/* Turnstile widget */}
      {turnstileSiteKey && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div 
            class="cf-turnstile" 
            data-sitekey={turnstileSiteKey}
            data-callback="onTurnstileSuccess"
          />
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        </div>
      )}

      {/* Response container */}
      <div id="form-response"></div>

      {/* Submit button - Safety Amber */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '1rem 2rem',
          background: '#f59e0b',
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: 700,
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <span>Get Your Free Quote</span>
        <span id="form-loading" class="htmx-indicator" style={{ display: 'none' }}>
          ⏳
        </span>
      </button>

      {/* UTM capture script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const params = new URLSearchParams(window.location.search);
          document.getElementById('utm_source').value = params.get('utm_source') || '';
          document.getElementById('utm_medium').value = params.get('utm_medium') || '';
          document.getElementById('utm_campaign').value = params.get('utm_campaign') || '';
          document.getElementById('landing_page').value = window.location.pathname;
        })();
      `}} />
    </form>
  );
};

/**
 * FormField - Reusable input field with floating label and validation
 */
interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  autocomplete?: string;
  placeholder?: string;
  validateEndpoint?: string;
}

const FormField: FC<FormFieldProps> = ({
  name,
  label,
  type,
  required,
  autocomplete,
  placeholder,
  validateEndpoint
}) => {
  const htmxAttrs = validateEndpoint ? {
    'hx-post': validateEndpoint,
    'hx-trigger': 'blur',
    'hx-target': `#${name}-error`,
    'hx-swap': 'innerHTML',
    'hx-include': `[name="${name}"]`
  } : {};

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label 
        for={name}
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem'
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
        {...htmxAttrs}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid #d1d5db',
          fontSize: '1rem',
          transition: 'border-color 0.2s'
        }}
      />
      <div 
        id={`${name}-error`} 
        style={{ 
          minHeight: '1.25rem',
          marginTop: '0.25rem'
        }}
      />
    </div>
  );
};

/**
 * Success message after form submission
 */
export const LeadFormSuccess: FC<{ name?: string }> = ({ name }) => (
  <div style={{
    background: '#ecfdf5',
    border: '1px solid #10b981',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center',
    marginBottom: '1rem'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
    <h3 style={{ color: '#059669', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
      Thank you{name ? `, ${name}` : ''}!
    </h3>
    <p style={{ color: '#047857' }}>
      We've received your inquiry and will be in touch within 24 hours.
    </p>
  </div>
);

/**
 * Validation error fragment
 */
export const ValidationError: FC<{ message: string }> = ({ message }) => (
  <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>
    {message}
  </p>
);

/**
 * Validation success (empty - no error)
 */
export const ValidationSuccess: FC = () => <span />;

export default LeadForm;
