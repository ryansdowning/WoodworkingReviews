import { BasicProductReview, Feedback, Product, Rating } from "../../utilities/types/products";
import { FeedbackCard } from "./FeedbackCard";
import ProductCard from "./ProductCard";
import { Stack, StackProps, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

export interface ProductPageStackProps extends Omit<StackProps, "children"> {
  product: Product;
  categoryName: string;
  basicReview: BasicProductReview;
  ratings: Rating[];
  feedbacks: Feedback[];
}

export function ProductPageStack({
  product,
  categoryName,
  basicReview,
  ratings,
  feedbacks,
  sx,
  ...others
}: ProductPageStackProps) {
  return (
    <Stack sx={{ ...sx }} {...others}>
      <Link href="/">
        <IconArrowLeft />
      </Link>
      <ProductCard
        product={product}
        categoryName={categoryName}
        basicReview={basicReview}
        showSeeMore={false}
      />
      <Title order={2}>Reviews</Title>
      <Stack>
        {feedbacks.map((feedback, i) => (
          <FeedbackCard feedback={feedback} key={i} />
        ))}
      </Stack>
    </Stack>
  );
}
