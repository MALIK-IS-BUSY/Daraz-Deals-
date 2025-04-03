import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark?: string;
      secondary: string;
      accent: string;
      text: string;
      lightText: string;
      darkGray: string;
      mediumGray: string;
      lightGray: string;
      border: string;
      white: string;
      error: string;
      success: string;
      warning: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    transitions: {
      fast: string;
      default: string;
      slow: string;
    };
  }
} 