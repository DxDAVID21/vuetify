/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

/**
 * Paleta de l'aplicació.
 *
 * Definim els colors com a *tokens* del tema (en lloc d'escriure'ls
 * directament als components) perquè tota la interfície els comparteixi i
 * el contrast es mantingui consistent en mode clar i fosc.
 */
const lightTheme = {
  dark: false,
  colors: {
    'background': '#F4F5FB',
    'surface': '#FFFFFF',
    'surface-variant': '#E8E7F3',
    'on-surface': '#1F2233',
    'on-surface-variant': '#565A70',
    'primary': '#4F46E5',
    'primary-darken-1': '#4338CA',
    'secondary': '#7C3AED',
    'secondary-darken-1': '#6D28D9',
    'accent': '#F59E0B',
    'error': '#DC2626',
    'info': '#0284C7',
    'success': '#16A34A',
    'warning': '#D97706',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  },
}

const darkTheme = {
  dark: true,
  colors: {
    'background': '#0F1020',
    'surface': '#1B1D33',
    'surface-variant': '#262A45',
    'on-surface': '#E7E8F2',
    'on-surface-variant': '#AEB2C7',
    'primary': '#818CF8',
    'primary-darken-1': '#6366F1',
    'secondary': '#A78BFA',
    'secondary-darken-1': '#8B5CF6',
    'accent': '#FBBF24',
    'error': '#F87171',
    'info': '#38BDF8',
    'success': '#4ADE80',
    'warning': '#FBBF24',
    'on-primary': '#111327',
    'on-secondary': '#111327',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'system',
    utilities: false,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})
