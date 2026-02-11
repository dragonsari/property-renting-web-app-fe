export type Property = {
  id: number;
  name: string;
  image: string;
  category: { id: number; name: string };
  lowestPrice: number;
};
