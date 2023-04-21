import { URL_ROOT } from "../utilities/urls";
import { ActionIcon, Card, Modal, Stack, Title } from "@mantine/core";
import { IconBrandReddit } from "@tabler/icons";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      setCookie("token", token);
      router.push("/");
    }
  }, [token]);

  return (
    <Modal centered={true} opened={true} onClose={() => {}} withCloseButton={false}>
      <Stack align="center">
        <Title order={3}>Login with Reddit</Title>
        <Card shadow="md">
          <ActionIcon size="xl" variant="subtle">
            <IconBrandReddit color="black" onClick={() => router.push(`${URL_ROOT}/accounts/reddit-auth/`)} />
          </ActionIcon>
        </Card>
      </Stack>
    </Modal>
  );
}
