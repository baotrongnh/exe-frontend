/**
 * Design System - Theme Configuration
 * Centralized design tokens for consistent UI
 */

export const theme = {
     // Colors
     colors: {
          primary: {
               50: 'hsl(var(--primary) / 0.05)',
               100: 'hsl(var(--primary) / 0.1)',
               200: 'hsl(var(--primary) / 0.2)',
               500: 'hsl(var(--primary))',
               600: 'hsl(var(--primary) / 0.9)',
               700: 'hsl(var(--primary) / 0.8)',
          },
          success: {
               light: 'hsl(142 76% 96%)',
               DEFAULT: 'hsl(142 76% 36%)',
               dark: 'hsl(142 76% 26%)',
          },
          error: {
               light: 'hsl(0 84% 96%)',
               DEFAULT: 'hsl(0 84% 60%)',
               dark: 'hsl(0 84% 50%)',
          },
          warning: {
               light: 'hsl(38 92% 96%)',
               DEFAULT: 'hsl(38 92% 50%)',
               dark: 'hsl(38 92% 40%)',
          },
     },

     // Spacing
     spacing: {
          xs: '0.25rem',    // 4px
          sm: '0.5rem',     // 8px
          md: '1rem',       // 16px
          lg: '1.5rem',     // 24px
          xl: '2rem',       // 32px
          '2xl': '3rem',    // 48px
          '3xl': '4rem',    // 64px
     },

     // Typography
     typography: {
          h1: {
               size: '2.25rem',   // 36px
               weight: '700',
               lineHeight: '2.5rem',
          },
          h2: {
               size: '1.875rem',  // 30px
               weight: '600',
               lineHeight: '2.25rem',
          },
          h3: {
               size: '1.5rem',    // 24px
               weight: '600',
               lineHeight: '2rem',
          },
          h4: {
               size: '1.25rem',   // 20px
               weight: '600',
               lineHeight: '1.75rem',
          },
          body: {
               size: '1rem',      // 16px
               weight: '400',
               lineHeight: '1.5rem',
          },
          small: {
               size: '0.875rem',  // 14px
               weight: '400',
               lineHeight: '1.25rem',
          },
     },

     // Border Radius
     radius: {
          sm: '0.25rem',   // 4px
          md: '0.5rem',    // 8px
          lg: '0.75rem',   // 12px
          xl: '1rem',      // 16px
          full: '9999px',
     },

     // Shadows
     shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
     },

     // Transitions
     transitions: {
          fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
          normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
     },

     // Z-Index
     zIndex: {
          dropdown: 1000,
          sticky: 1020,
          fixed: 1030,
          modalBackdrop: 1040,
          modal: 1050,
          popover: 1060,
          tooltip: 1070,
     },
} as const;

export type Theme = typeof theme;
