export interface Course {
  _id?: string;
  title: string;
  description: string;
  objectives: string;
  photo: string;
  slug: string;
  weeks: string;
  tuition: number;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt: any;
  user: string;
}
