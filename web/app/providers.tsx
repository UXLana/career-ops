'use client';

import { SwitchableThemeProvider } from '@lumen/design-system/styles/themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SwitchableThemeProvider>
      {children}
    </SwitchableThemeProvider>
  );
}
