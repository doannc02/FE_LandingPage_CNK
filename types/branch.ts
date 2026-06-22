export interface BranchCoachSummary {
  coachId: string;
  fullName: string;
  title: string;
  avatarUrl: string | null;
}

export interface BranchListItem {
  id: string;
  code: string;
  name: string;
  shortName: string | null;
  address: string | null;
  area: string | null;
  thumbnail: string | null;
  latitude: number | null;
  longitude: number | null;
  schedule: string | null;
  fee: string | null;
  isFree: boolean;
  isActive: boolean;
  activeStudentCount: number;
  coaches: BranchCoachSummary[];
}

export interface BranchCoachDetail {
  coachId: string;
  fullName: string;
  /** "HeadCoach" | "AssistantCoach" */
  title: string;
  bio: string | null;
  specialization: string | null;
  yearsOfExperience: number;
  certifications: string[] | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  phone: string | null;
  email: string | null;
}

export interface BranchGalleryItem {
  id: string;
  mediaUrl: string;
  /** "Image" | "Video" */
  mediaType: string;
  caption: string | null;
  displayOrder: number;
}

export interface BranchDetail {
  id: string;
  code: string;
  name: string;
  shortName: string | null;
  address: string | null;
  area: string | null;
  thumbnail: string | null;
  latitude: number | null;
  longitude: number | null;
  schedule: string | null;
  fee: string | null;
  isFree: boolean;
  description: string | null;
  isActive: boolean;
  coaches: BranchCoachDetail[];
  gallery: BranchGalleryItem[];
}
