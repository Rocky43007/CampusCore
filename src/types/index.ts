// Color Palette Type
// Add Ionicons import if using keyof typeof Ionicons.glyphMap
import { Ionicons } from '@expo/vector-icons';

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  light: string;
  dark: string;
  accent: string;
}

// Link Types
export interface WebLink {
  ios: string;
  android: string;
  browser?: string;
}

export interface AppLink {
  ios: string;
  android: string;
  web: string | WebLink;
}

export interface AppLinks {
  fitness: AppLink;
  printing: AppLink;
  transport: {
    bus: AppLink;
    bike: AppLink;
  };
}

// Component Data Types
export interface IServiceTile {
  icon: keyof typeof Ionicons.glyphMap; // Use keyof for better type safety if possible
  title: string;
  color: string;
  link?: () => void;
}

export interface QuickLink {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  link: string;
}

// Event Types (from EventsScreen)
export interface EventCategory {
  id: number;
  name: string;
}

export interface EventOrganization {
  id: number;
  name: string;
  profilePicture?: string;
}

export interface EventLocation {
  name: string;
  address?: string;
  isVirtual?: boolean;
  virtualLink?: string;
}

export interface CampusEvent {
  id: number;
  name: string;
  description: string;
  startsOn: string;
  endsOn: string;
  imagePath?: string;
  location: EventLocation;
  categories: EventCategory[];
  organization: EventOrganization;
}