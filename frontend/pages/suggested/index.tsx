import { SuggestedProductCard } from "../../components/Products/SuggestedProductCard";
import { WWReviewsAppShell } from "../../components/WWReviewsAppShell/WWReviewsAppShell";
import { useResources } from "../../utilities/hooks";
import { SugesstedProduct } from "../../utilities/types/products";
import { Stack, Title } from "@mantine/core";

export default function SuggestedProductsPage() {
  const [suggestedProducts] = useResources<SugesstedProduct>("products/suggested-product/");
  return (
    <WWReviewsAppShell>
      <Stack>
        <Title>Suggested Products</Title>
        <Stack>
          {suggestedProducts.map((suggestedProduct) => (
            <SuggestedProductCard suggestedProduct={suggestedProduct} />
          ))}
        </Stack>
      </Stack>
    </WWReviewsAppShell>
  );
}
