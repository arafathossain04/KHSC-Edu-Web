export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  batch: string;
  roll_number: string;
  class_level: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  student_name: string;
  batch: string;
  rating: number;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  attachment_url: string;
  created_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  subject: string;
  photo_url: string;
  faculty_type: 'teacher' | 'staff' | 'principal' | 'ex_principal' | 'ex_chairman';
  bio: string;
  email: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AcademicFile {
  id: string;
  title: string;
  file_type: 'routine' | 'syllabus' | 'calendar';
  class_level: string;
  file_url: string;
  uploaded_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  media_url: string;
  media_type: 'photo' | 'video';
  category: string;
  is_featured: boolean;
  created_at: string;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}
