export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  token: string;
  cart: any;
  purchased_courses: [any];
}
