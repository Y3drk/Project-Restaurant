export class User{
  id?: string;
  uid?: string;
  nickname?: string;
  banned?: boolean;
  roles?: string[];
  orders?: {name: string, amount: number, ifRated: boolean, ifReviewed: boolean}[];
}
