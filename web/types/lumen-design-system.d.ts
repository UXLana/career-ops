declare module '@lumen/design-system/components' {
  import type { ComponentType, ReactNode } from 'react';

  export type DataTableColumn<T = Record<string, unknown>> = {
    key: string;
    header: string;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
    sortable?: boolean;
    render?: (row: T, index: number) => ReactNode;
    cardLabel?: string;
    cardPrimary?: boolean;
    hideOnCard?: boolean;
    srOnly?: boolean;
    visible?: boolean;
  };

  export type TabItem = {
    id: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
    disabled?: boolean;
  };

  export const Badge: ComponentType<any>;
  export const Button: ComponentType<any>;
  export const CollectionToolbar: ComponentType<any>;
  export const DataTable: ComponentType<any>;
  export const Input: ComponentType<any>;
  export const StatsCard: ComponentType<any>;
  export const StatsCardGroup: ComponentType<any>;
  export const TabBar: ComponentType<any>;
  export const Textarea: ComponentType<any>;
}
