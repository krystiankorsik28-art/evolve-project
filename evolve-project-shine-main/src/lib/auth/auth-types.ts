export type AuthProvider = "google" | "github" | "microsoft" | "apple" | "discord" | "linkedin";

export type UserRole = "student" | "teacher" | "admin" | "parent" | "organization_admin" | "super_admin";

export type AuthState = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole | null;
  roles: UserRole[];
  isApproved: boolean;
  twoFactorEnabled: boolean;
  language: string;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  deviceName: string | null;
  deviceType: string | null;
  ip: string | null;
  location: string | null;
  createdAt: string;
  lastActive: string;
  isCurrent: boolean;
};

export type AuthDevice = {
  id: string;
  userId: string;
  name: string;
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os: string | null;
  browser: string | null;
  trusted: boolean;
  lastUsed: string;
  createdAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: "free" | "basic" | "pro" | "enterprise";
  createdAt: string;
  memberCount: number;
};

export type PasskeyCredential = {
  id: string;
  name: string | null;
  createdAt: string;
  lastUsed: string | null;
};
