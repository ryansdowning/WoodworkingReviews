import { createResource } from "../../utilities/networking";
import { User } from "../../utilities/types/base";
import { Feedback, Product, Rating } from "../../utilities/types/products";
import { StarsGroup } from "../StarsGroup/StarsGroup";
import { Button, Group, Modal, ModalProps, Stack, Textarea, Title, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export interface ReviewProductModalProps extends Omit<ModalProps, "children"> {
  product: Product;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export function ReviewProductModal({
  product,
  opened,
  setOpened,
  onClose,
  ...others
}: ReviewProductModalProps) {
  const [starValue, setStarValue] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
        setOpened(false);
      }}
      {...others}
    >
      <Stack>
        <Title order={3}>{product.name}</Title>
        <Stack spacing={0}>
          <Group spacing={0}>
            <StarsGroup
              stars={starValue}
              onClickStar={(star) => (star === starValue ? setStarValue(0) : setStarValue(star))}
            />
            <Text mb="sm" color="red">
              *
            </Text>
          </Group>
          <Textarea ref={ref} label="Feedback (optional)" placeholder="share your experience..." />
        </Stack>
        <Button
          sx={{ width: "fit-content" }}
          onClick={() => {
            if (starValue === 0) {
              alert("You must select a star rating between 1 and 5.");
              return;
            }
            createResource<Omit<Rating, "user" | "updated_at" | "created_at">>("products/rating/", {
              product: product.id,
              value: starValue,
            })
              ?.then(() => {
                if (ref.current?.value && ref.current.value !== "")
                  createResource<Omit<Feedback, "user" | "updated_at" | "created_at">>("products/feedback/", {
                    product: product.id,
                    text: ref.current.value,
                  });
              })
              .then(() => {
                setStarValue(0);
                if (ref.current) ref.current.value = "";
                setOpened(false);
                onClose();
              });
          }}
        >
          Submit Review
        </Button>
      </Stack>
    </Modal>
  );
}
