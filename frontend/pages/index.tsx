import { WWReviewsAppShell } from "../components/WWReviewsAppShell/WWReviewsAppShell";
import { Welcome } from "../components/Welcome/Welcome";

export default function HomePage() {
  return (
    <WWReviewsAppShell>
      <Welcome />
    </WWReviewsAppShell>
  );
}
