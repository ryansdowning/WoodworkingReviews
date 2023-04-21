import { formatDollars } from "../../utilities/formatting";
import { useDark, useUser } from "../../utilities/hooks";
import { BasicProductReview, Product } from "../../utilities/types/products";
import { StarsGroup } from "../StarsGroup/StarsGroup";
import { ReviewProductModal } from "./ReviewProductModal";
import { Badge, Card, CardProps, Stack, Title, Text, Group, Button, Indicator } from "@mantine/core";
import { IconLink, IconMessageCircle2 } from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export interface ProductCardProps extends Omit<CardProps, "children"> {
  product: Product;
  categoryName: string;
  basicReview: BasicProductReview;
  showSeeMore?: boolean;
}

export default function ProductCard({
  product,
  categoryName,
  basicReview,
  showSeeMore,
  sx,
  ...others
}: ProductCardProps) {
  const [user] = useUser();
  const router = useRouter();
  const dark = useDark();
  const [reviewModalOpened, setReviewModalOpened] = useState(false);

  return (
    <>
      <ReviewProductModal
        product={product}
        opened={reviewModalOpened}
        setOpened={setReviewModalOpened}
        onClose={() => setReviewModalOpened(false)}
      />
      <Card shadow="md" radius="sm" sx={{ ...sx }} {...others}>
        <Group position="apart">
          <Stack sx={{ maxWidth: "60%" }}>
            <Group align="center" spacing="sm">
              <Badge color="yellow" sx={{ width: "fit-content", height: "fit-content" }}>
                {categoryName}
              </Badge>
              {basicReview && basicReview.average_rating && (
                <StarsGroup stars={basicReview.average_rating} count={basicReview.rating_count} />
              )}
              {basicReview.feedback_count > 0 && (
                <Indicator
                  label={<Text color={dark ? "lightgray" : "black"}>{basicReview.feedback_count}</Text>}
                  position="middle-center"
                  color="rgba(0, 0, 0, 0)"
                >
                  <IconMessageCircle2 size={24} stroke={1.5} style={{ marginTop: "7px" }} />
                </Indicator>
              )}
            </Group>
            <Title
              order={3}
              onClick={() => router.push(`/product/${product.id}`)}
              sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              {product.name}
            </Title>
            <Group spacing="xs">
              <Text size="lg">{formatDollars(product.price)}</Text>
              {product.link && (
                <Link href={product.link} target="_blank" rel="noreferrer" style={{ marginTop: "5px" }}>
                  <IconLink color="gray" size={24} style={{ cursor: "pointer" }} />
                </Link>
              )}
            </Group>
            <Group>
              <Button
                sx={{ width: "fit-content" }}
                onClick={() => (user ? setReviewModalOpened(true) : alert("Please login to leave a review!"))}
              >
                Leave a Review!
              </Button>
              {(typeof showSeeMore === "undefined" || showSeeMore) && (
                <Link href={`/product/${product.id}`}>
                  <Button
                    variant="outline"
                    color={dark ? "gray" : "dark"}
                    sx={{ width: "fit-content" }}
                    onClick={() => {}}
                  >
                    See more
                  </Button>
                </Link>
              )}
            </Group>
          </Stack>
          {product.image_url && (
            <Card mr="md" shadow="sm" sx={{ position: "relative", width: 200, height: 200 }}>
              <Image
                loader={() => product.image_url!}
                src={product.image_url}
                quality={100}
                alt={`Image of ${product.name}`}
                style={{ objectFit: "contain" }}
                fill
              />
            </Card>
          )}
        </Group>
      </Card>
    </>
  );
}
