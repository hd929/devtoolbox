export type ToolCategory = 
  | 'formatters'
  | 'security'
  | 'converters'
  | 'text-media';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  badge?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
