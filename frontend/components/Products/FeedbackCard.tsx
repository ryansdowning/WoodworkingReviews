import { Feedback } from "../../utilities/types/products";
import { Card, CardProps, Stack, Text } from "@mantine/core";

export interface FeedbackCardProps extends Omit<CardProps, "children"> {
  feedback: Feedback;
}

export function FeedbackCard({ feedback, ...others }: FeedbackCardProps) {
  return (
    <Card shadow="md" {...others}>
      <Stack>
        <Text size="sm">{feedback.created_at.toLocaleString()}</Text>
        <Text>{feedback.text}</Text>
      </Stack>
    </Card>
  );
}
