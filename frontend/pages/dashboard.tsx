import { WWReviewsAppShell } from "../components/WWReviewsAppShell/WWReviewsAppShell";
import { Welcome } from "../components/Welcome/Welcome";

export default function DashboardPage() {
  return (
    <WWReviewsAppShell>
      <Welcome />
    </WWReviewsAppShell>
  );
}
