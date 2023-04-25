import { BasicProductReview, Feedback, Product, Rating } from "../../utilities/types/products";
import { FeedbackCard } from "./FeedbackCard";
import ProductCard from "./ProductCard";
import { Card, Stack, StackProps, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

export interface ProductPageStackProps extends Omit<StackProps, "children"> {
  product: Product;
  categoryName: string;
  basicReview: BasicProductReview;
  ratings: Rating[];
  feedbacks: Feedback[];
  refreshFeedbacks: () => void;
}

export function ProductPageStack({
  product,
  categoryName,
  basicReview,
  ratings,
  feedbacks,
  refreshFeedbacks,
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
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, i) => (
            <FeedbackCard feedback={feedback} refreshFeedbacks={refreshFeedbacks} key={i} />
          ))
        ) : (
          <Card shadow="md">No reviews yet!</Card>
        )}
      </Stack>
    </Stack>
  );
}
