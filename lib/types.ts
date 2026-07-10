export type UserRole = "admin" | "member";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

export type LinkStatus = "active" | "paused";

export type Link = {
  id: string;
  userId: string;
  title: string;
  destinationUrl: string;
  slug: string;
  campaign: string;
  source: string;
  medium: string;
  status: LinkStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Click = {
  id: string;
  linkId: string;
  userAgent: string;
  referrer: string;
  ipHash: string;
  country: string;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

export type Database = {
  users: User[];
  links: Link[];
  clicks: Click[];
  sessions: Session[];
};

export type LinkWithStats = Link & {
  totalClicks: number;
  lastSevenDays: number;
  sparkline: number[];
};
