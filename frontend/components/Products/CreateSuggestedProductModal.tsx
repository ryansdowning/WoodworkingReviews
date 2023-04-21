import { createResource } from "../../utilities/networking";
import { SugesstedProduct } from "../../utilities/types/products";
import { Button, Group, Modal, ModalProps, NumberInput, Stack, TextInput, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";

export interface CreateSuggestedProductModalProps extends Omit<ModalProps, "children"> {
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export function CreateSuggestedProductModal({ setOpened, ...others }: CreateSuggestedProductModalProps) {
  const form = useForm({ initialValues: { name: "", price: 0, link: "", image_url: "", category: "" } });
  return (
    <Modal {...others}>
      <Stack>
        <Stack spacing="xs">
          <Title order={3}>Suggest a Product</Title>
          <Text size="xs">Please search to ensure the product does not already exist.</Text>
        </Stack>
        <form
          onSubmit={form.onSubmit((values) =>
            createResource<Omit<SugesstedProduct, "user" | "updated_at" | "created_at">>(
              "products/suggested-product/",
              values
            )
              ?.then(form.reset)
              .then(() => setOpened(false))
          )}
        >
          <TextInput placeholder="name..." label="Name" required {...form.getInputProps("name")} />
          <NumberInput
            label="Price"
            required
            defaultValue={100}
            precision={2}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              value ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : "$ "
            }
            {...form.getInputProps("price")}
          />
          <TextInput placeholder="link..." label="Link to Product" required {...form.getInputProps("link")} />
          <TextInput
            placeholder="image..."
            label="Link to Product Image"
            required
            {...form.getInputProps("image_url")}
          />
          <TextInput
            placeholder="category..."
            label="Category"
            required
            {...form.getInputProps("category")}
          />
          <Group grow={true} mt={10}>
            <Button onClick={() => setOpened(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}
