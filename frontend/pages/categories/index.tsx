import { CategoryCard } from "../../components/Products/CategoryCard";
import { CreateCategoryModal } from "../../components/Products/CreateCategoryModal";
import { WWReviewsAppShell } from "../../components/WWReviewsAppShell/WWReviewsAppShell";
import { useResources } from "../../utilities/hooks";
import { makeRequest } from "../../utilities/networking";
import { Category } from "../../utilities/types/products";
import { URL_ROOT } from "../../utilities/urls";
import { Button, Card, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import { useState } from "react";

export default function CategoriesPage() {
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [parentCategory, setParentCategory] = useState<Category | undefined>(undefined);
  const [categories] = useResources<Category>("products/category/", {
    isAuthorized: false,
    filters: category ? { parent: category.id } : { no_parent: true },
    dependsOn: [category],
  });
  const [createModalOpened, setCreateModalOpened] = useState(false);

  return (
    <WWReviewsAppShell>
      <CreateCategoryModal
        parent={category}
        opened={createModalOpened}
        setOpened={setCreateModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
      <Stack>
        <Title>Category Editor</Title>
        {category && (
          <IconArrowLeft
            onClick={() => {
              setCategory(parentCategory);
              if (parentCategory?.parent) {
                makeRequest("GET", URL_ROOT, `products/category/${parentCategory.parent}/`, {})?.then(
                  (data) => setParentCategory(data)
                );
              } else {
                setParentCategory(undefined);
              }
            }}
            style={{ cursor: "pointer" }}
          />
        )}
        {category && <Title order={3}>Parent Category: {category.name}</Title>}
        <Stack>
          {categories.length > 0 ? (
            categories.map((category_, i) => (
              <CategoryCard
                category={category_}
                onClick={() => {
                  setParentCategory(category);
                  setCategory(category_);
                }}
                key={i}
              />
            ))
          ) : (
            <Card shadow="md">
              <Title order={2}>Category has no subcategories!</Title>
            </Card>
          )}
        </Stack>
        <Button sx={{ width: "fit-content" }} onClick={() => setCreateModalOpened(true)}>
          + Category
        </Button>
      </Stack>
    </WWReviewsAppShell>
  );
}
