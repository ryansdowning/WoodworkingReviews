import { useUser } from "../../utilities/hooks";
import { deleteResource } from "../../utilities/networking";
import { MEMBER_ROLE_NAMES } from "../../utilities/types/accounts";
import { Feedback } from "../../utilities/types/products";
import { StarsGroup } from "../StarsGroup/StarsGroup";
import { ActionIcon, Card, CardProps, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons";

export interface FeedbackCardProps extends Omit<CardProps, "children"> {
  feedback: Feedback;
  refreshFeedbacks: () => void;
}

export function FeedbackCard({ feedback, refreshFeedbacks, ...others }: FeedbackCardProps) {
  const [user, member] = useUser();
  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm",
      children: <Text size="sm">Are you sure you want to delete this review?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: () => deleteResource("products/feedback/", feedback.id)?.then(() => refreshFeedbacks()),
      confirmProps: { color: "red" },
    });
  return (
    <Card shadow="md" {...others}>
      <Stack>
        <Group position="apart">
          <Stack spacing={1}>
            <Text size="sm">Posted by {feedback.username}</Text>
            <Text size="xs">{feedback.created_at.toLocaleString()}</Text>
          </Stack>
          {(feedback.user === user?.id || (member && member.role === MEMBER_ROLE_NAMES.MODERATOR)) && (
            <ActionIcon variant="subtle" onClick={openModal}>
              <IconTrash color="red" />
            </ActionIcon>
          )}
        </Group>
        <Stack spacing="xs">
          <StarsGroup stars={feedback.rating} starSize={16} />
          <Text>{feedback.text}</Text>
        </Stack>
      </Stack>
    </Card>
  );
}
