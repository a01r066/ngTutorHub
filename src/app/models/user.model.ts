export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  token: string;
  purchased_courses: [string];
}
