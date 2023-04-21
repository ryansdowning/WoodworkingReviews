import { Resource, TrackedMixin } from "./base";

export type Category = Resource & {
  name: string;
  parent: number | undefined;
};

type AbstractProduct = Resource &
  TrackedMixin & {
    name: string;
    price: number;
    link: string;
    image_url: string;
  };

export type SugesstedProduct = AbstractProduct & {
  user: number;
  category: string;
};

export type Product = AbstractProduct & {
  category: number;
};

export const PRODUCT_ACTIONS = {
  1: "NAME_UPDATED",
  2: "PRICE_UPDATED",
  3: "LINK_UPDATED",
  4: "IMAGE_UPDATED",
  5: "CATEGORY_UPDATED",
};
export const PRODUCT_ACTION_NAMES = Object.entries(PRODUCT_ACTIONS).reduce((obj, pair) => {
  obj[pair[1]] = parseInt(pair[0]);
  return obj;
}, Object());
export type ProductAction = Resource &
  TrackedMixin & {
    product: number;
    action: number;
    details: Record<string, any>;
  };

export type Rating = Resource &
  TrackedMixin & {
    product: number;
    user: number;
    value: number;
  };

export type Feedback = Resource &
  TrackedMixin & {
    product: number;
    user: number;
    text: string;
  };

export type BasicProductReview = Resource & {
  feedback_count: number;
  rating_count: number;
  average_rating: number | undefined;
};
