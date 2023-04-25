import { useResource } from "../../utilities/hooks";
import { createResource, deleteResource, makeRequest } from "../../utilities/networking";
import { User } from "../../utilities/types/base";
import { Category, Product, SugesstedProduct } from "../../utilities/types/products";
import { URL_ROOT } from "../../utilities/urls";
import { Button, Card, CardProps, Group, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";

export interface SuggestedProductCardProps extends Omit<CardProps, "children"> {
  suggestedProduct: SugesstedProduct;
  refreshSuggestedProducts: () => Promise<any>;
}

export function SuggestedProductCard({
  suggestedProduct,
  refreshSuggestedProducts,
  ...others
}: SuggestedProductCardProps) {
  const [user] = useResource<User>("auth/user/", suggestedProduct.user, { isAuthorized: true });
  return (
    <Card shadow="md" {...others}>
      <Stack>
        <Stack spacing="xs">
          <TextInput
            label="Suggested by"
            value={user?.username}
            sx={{ input: { "&:disabled": { cursor: "default" } } }}
          />
          <TextInput
            label="Name"
            value={suggestedProduct.name}
            sx={{ input: { "&:disabled": { cursor: "default" } } }}
          />
          <TextInput
            label="Price"
            value={suggestedProduct.price.toString()}
            sx={{ input: { "&:disabled": { cursor: "default" } } }}
          />
          <Link href={suggestedProduct.link} target="_blank" rel="noreferrer">
            <TextInput
              label="Product Link (click at your own risk)"
              value={suggestedProduct.link}
              sx={{ input: { cursor: "pointer" } }}
            />
          </Link>
          <Link href={suggestedProduct.link} target="_blank" rel="noreferrer">
            <TextInput
              label="Image Link (click at your own risk)"
              value={suggestedProduct.image_url}
              sx={{ input: { cursor: "pointer" } }}
            />
          </Link>
        </Stack>
        <Group>
          <Button
            color="green"
            onClick={() =>
              makeRequest("GET", URL_ROOT, "products/category/", { name: suggestedProduct.category })?.then(
                (categories: Category[]) => {
                  if (categories.length === 0) {
                    alert(
                      "Hey sorry this part is really scuffed right now. There isn't currently a category that matches the one suggested here. Please go to the categories page and create a matching one in the appropriate place and then come back here to approve the product."
                    );
                    return undefined;
                  } else {
                    return createResource<Omit<Product, "created_at" | "updated_at">>("products/product", {
                      name: suggestedProduct.name,
                      price: suggestedProduct.price,
                      link: suggestedProduct.link,
                      image_url: suggestedProduct.image_url,
                      category: categories[0].id,
                    })?.then((product) =>
                      showNotification({
                        title: "Approved!",
                        message: `Successully approved the suggestion, the product is now listed at /product/${product.id}`,
                      })
                    );
                  }
                }
              )
            }
          >
            Approve
          </Button>
          <Button
            color="red"
            onClick={() =>
              deleteResource("products/suggested-product/", suggestedProduct.id)?.then(() =>
                refreshSuggestedProducts().then(() =>
                  showNotification({
                    title: "Deleted!",
                    message: "This product suggestion has been deleted.",
                  })
                )
              )
            }
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
