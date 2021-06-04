export interface User {
  _id?: string;
  displayName: string;
  fName: string;
  lName: string;
  headLine: string;
  email: string;
  photoURL: string;
  isSocial: boolean;
  role: string;
  token: string;
  cart: any;
  purchased_courses: [any];
}
