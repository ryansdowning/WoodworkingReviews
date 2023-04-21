import { Group, GroupProps, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons";

export interface StarsGroupProps extends GroupProps {
  stars: number;
  totalStars?: number;
  starSize?: number;
  starColor?: string;
  count?: number;
  onClickStar?: (star: number) => void;
}

export function StarsGroup({ stars, count, onClickStar, ...others }: StarsGroupProps) {
  const { totalStars = 5, starSize = 20, starColor = "#FCC419", ...groupProps } = others;
  return (
    <Group spacing="xs">
      <Group spacing={0} {...groupProps}>
        {[...Array(stars)].map((_, i) => (
          <IconStar
            key={i}
            color={starColor}
            size={starSize}
            fill={starColor}
            onClick={() => onClickStar && onClickStar(i + 1)}
          />
        ))}
        {[...Array(totalStars - stars)].map((_, i) => (
          <IconStar
            key={i}
            color={starColor}
            size={starSize}
            onClick={() => onClickStar && onClickStar(i + 1 + stars)}
          />
        ))}
      </Group>
      {typeof count !== "undefined" && <Text>{`(${count})`}</Text>}
    </Group>
  );
}
