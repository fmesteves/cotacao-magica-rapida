export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
}

export interface EmailParams {
  to: string | string[];
  subject: string;
  template: string;
  variables?: Record<string, any>;
  from?: string;
  replyTo?: string;
  baseConfig?: BaseTemplateConfig;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  id?: string;
}

export interface BaseTemplateConfig {
  headerColor?: string;
  footerColor?: string;
  headerImage?: string;
  footerImage?: string;
  companyName?: string;
  companyLogo?: string;
} 