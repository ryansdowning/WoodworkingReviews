import { createResource } from "../../utilities/networking";
import { Category } from "../../utilities/types/products";
import { Button, Group, Modal, ModalProps, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";

export interface CreateCategoryModalProps extends Omit<ModalProps, "children"> {
  parent: Category | undefined;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export function CreateCategoryModal({ parent, setOpened, ...others }: CreateCategoryModalProps) {
  const form = useForm({ initialValues: { name: "" } });
  return (
    <Modal {...others}>
      <Stack>
        <Title order={3}>Parent Category: {parent ? parent.name : "Root"}</Title>
        <form
          onSubmit={form.onSubmit((values) =>
            createResource<Category>("products/category/", { parent: parent?.id, ...values })
              ?.then(form.reset)
              .then(() => setOpened(false))
          )}
        >
          <TextInput placeholder="Name" label="Name" required={true} {...form.getInputProps("name")} />
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
