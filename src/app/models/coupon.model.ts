export interface Coupon {
  _id?: string;
  code: string;
  description: string;
  discount: number;
  expire: Date;
}
