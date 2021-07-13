export interface Instructor {
  _id?: string;
  name: string;
  profession: string;
  highlight: string;
  students: number;
  rating: number;
  reviews: number;
  photoURL: string;
  courses: any[];
  categoryId: string;
}
