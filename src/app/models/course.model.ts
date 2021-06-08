export interface Course {
  _id?: string;
  title: string;
  description: string;
  objectives: string;
  photo: string;
  slug: string;
  category: string;
  bestseller: boolean;
  weeks: string;
  tuition: number;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt: any;
  user: string;
}
