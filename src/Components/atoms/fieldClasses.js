// Fluent 2 — shared form-field styling.
// Signature look: 1px neutral stroke with an accented bottom border that
// turns brand-blue on focus.
export const fieldBase =
  'w-full h-8 px-3 rounded-md text-sm text-ink bg-surface ' +
  'border border-stroke border-b-2 border-b-ink-muted ' +
  'placeholder:text-ink-muted transition-colors duration-150 ' +
  'focus:outline-none focus:border-b-brand ' +
  'disabled:bg-[#f0f0f0] disabled:text-ink-disabled disabled:cursor-not-allowed';

export const fieldError = 'border-red-500 border-b-red-600 focus:border-b-red-600';

export function fieldClasses({ error = false, className = '' } = {}) {
  return `${fieldBase} ${error ? fieldError : ''} ${className}`
    .replace(/\s+/g, ' ')
    .trim();
}
