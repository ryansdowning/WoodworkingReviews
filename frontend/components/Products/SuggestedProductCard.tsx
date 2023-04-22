import { useResource } from "../../utilities/hooks";
import { User } from "../../utilities/types/base";
import { SugesstedProduct } from "../../utilities/types/products";
import { Button, Card, CardProps, Group, Stack, TextInput } from "@mantine/core";
import Link from "next/link";

export interface SuggestedProductCardProps extends Omit<CardProps, "children"> {
  suggestedProduct: SugesstedProduct;
}

export function SuggestedProductCard({ suggestedProduct, ...others }: SuggestedProductCardProps) {
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
          <Button color="green" onClick={() => alert("coming soon!")}>
            Approve
          </Button>
          <Button color="red" onClick={() => alert("coming soon!")}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
