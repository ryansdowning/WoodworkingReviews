import { Category } from "../../utilities/types/products";
import { Card, CardProps, Group, Stack, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";

export interface CategoryCardProps extends Omit<CardProps, "children"> {
  category: Category;
  onClick: () => void;
}

export function CategoryCard({ category, onClick, sx, ...others }: CategoryCardProps) {
  return (
    <Card shadow="md" {...others} sx={{ cursor: "pointer", ...sx }} onClick={onClick}>
      <Stack>
        <Group position="apart">
          <Title order={3}>{category.name}</Title>
          <IconArrowRight stroke={1.5} />
        </Group>
      </Stack>
    </Card>
  );
}
