import { SuggestedProductCard } from "../../components/Products/SuggestedProductCard";
import { WWReviewsAppShell } from "../../components/WWReviewsAppShell/WWReviewsAppShell";
import { useResources } from "../../utilities/hooks";
import { SugesstedProduct } from "../../utilities/types/products";
import { Card, Stack, Title } from "@mantine/core";

export default function SuggestedProductsPage() {
  const [suggestedProducts, , refreshSuggestedProducts] = useResources<SugesstedProduct>(
    "products/suggested-product/"
  );
  return (
    <WWReviewsAppShell>
      <Stack>
        <Title>Suggested Products</Title>
        <Stack>
          {suggestedProducts.length > 0 ? (
            suggestedProducts.map((suggestedProduct) => (
              <SuggestedProductCard
                suggestedProduct={suggestedProduct}
                refreshSuggestedProducts={refreshSuggestedProducts}
              />
            ))
          ) : (
            <Card shadow="md">No suggested products!</Card>
          )}
        </Stack>
      </Stack>
    </WWReviewsAppShell>
  );
}
