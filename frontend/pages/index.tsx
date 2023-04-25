import { CreateSuggestedProductModal } from "../components/Products/CreateSuggestedProductModal";
import ProductCard from "../components/Products/ProductCard";
import { WWReviewsAppShell } from "../components/WWReviewsAppShell/WWReviewsAppShell";
import { usePaginationTotal, useResources, useUser } from "../utilities/hooks";
import { BasicProductReview, Category, Product } from "../utilities/types/products";
import { Button, Card, Group, Pagination, Select, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [user] = useUser();
  const [page, setPage] = useState(0);
  const [itemSearch, setItemSearch] = useState("");
  const [suggestProductModalOpened, setSuggestProductModalOpened] = useState(false);

  const productRequestOptions = {
    isAuthorized: false,
    filters: { name__icontains: itemSearch },
    debounceTime: 500,
  };
  const productsTotal = usePaginationTotal("products/product/", {
    ...productRequestOptions,
    limit: 1,
    dependsOn: [itemSearch],
  });
  const [products] = useResources<Product>("products/product/", {
    ...productRequestOptions,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    dependsOn: [page, itemSearch],
  });
  const [categories] = useResources<Category>("products/category/", { isAuthorized: false });
  const [productIds, setProductIds] = useState<number[] | undefined>(undefined);
  const [basicProductReviews] = useResources<BasicProductReview>("products/basic-product-review", {
    isAuthorized: false,
    filters: { ids: productIds },
    dependsOn: [productIds],
  });
  const [reviewMap, setReviewMap] = useState<Record<number, BasicProductReview>>({});

  useEffect(() => {
    setReviewMap(basicProductReviews.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}));
  }, [basicProductReviews]);
  useEffect(() => products && setProductIds(products.map((product) => product.id)), [products]);
  return (
    <WWReviewsAppShell>
      <CreateSuggestedProductModal
        opened={suggestProductModalOpened}
        setOpened={setSuggestProductModalOpened}
        onClose={() => setSuggestProductModalOpened(false)}
      />
      <Stack align="center">
        <Stack>
          <Group position="apart">
            <Group>
              <TextInput
                placeholder="search for an item..."
                sx={{ input: { marginRight: "100px" } }}
                color="gray"
                icon={<IconSearch stroke={1} />}
                onChange={(event) => setItemSearch(event.currentTarget.value)}
              />
              <Select placeholder="category" data={[]} />
            </Group>
            <Button
              onClick={() =>
                user ? setSuggestProductModalOpened(true) : alert("Please login to suggest a product!")
              }
            >
              Suggest Product
            </Button>
          </Group>
          {products.length > 0 ? (
            products.map(
              (product, i) =>
                typeof reviewMap[product.id] !== "undefined" && (
                  <ProductCard
                    product={product}
                    categoryName={
                      categories.find((category) => category.id === product.category)?.name || "Uncateogrized"
                    }
                    basicReview={reviewMap[product.id]}
                    key={i}
                  />
                )
            )
          ) : (
            <Card shadow="md">No products found!</Card>
          )}
        </Stack>
        <Pagination
          total={Math.ceil((productsTotal || 0) / PAGE_SIZE)}
          page={page + 1}
          onChange={(v) => setPage(v - 1)}
        />
      </Stack>
    </WWReviewsAppShell>
  );
}
