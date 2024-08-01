import clsx from "clsx";
import { redirect } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { auth, signIn } from "@/auth";
import { DASHBOARD_URL } from "@/constants";
import { SignInIcon } from "@/icons";
import { MarketingLayout } from "@/layouts/Marketing";
import { Button, LinkButton } from "@/primitives/Button";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

// Interface defining the props for the Feature component
interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
  description: ReactNode; // Description of the feature, passed as ReactNode
  title: ReactNode; // Title of the feature, passed as ReactNode
}

// Component to display a feature with a title and description
function Feature({ title, description, className, ...props }: FeatureProps) {
  return (
    <div className={clsx(className, styles.featuresFeature)} {...props}>
      <h4 className={styles.featuresFeatureTitle}>{title}</h4>
      <p className={styles.featuresFeatureDescription}>{description}</p>
    </div>
  );
}

// Main page component
export default async function Index() {
  const session = await auth(); // Check if the user is authenticated

  // If the user is logged in, redirect to the dashboard
  if (session) {
    redirect(DASHBOARD_URL);
  }
  return (
    <MarketingLayout>
      <Container className={styles.section}>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>Welcome to the SimR application</h1>
          <p className={styles.heroLead}>powered by PIA</p>
        </div>
        <div className={styles.heroActions}>
          <form
            action={async () => {
              "use server"; // Marks this form as a server action in Next.js
              await signIn(); // Sign in the user when the form is submitted
            }}
          >
            <Button icon={<SignInIcon />}>Sign in</Button>{" "}
            {/* Sign in button */}
          </form>
          <LinkButton
            href="https://parisinfrastructureadvisory.com/"
            target="_blank"
            variant="secondary"
          >
            About us {/* Link to external "About us" page */}
          </LinkButton>
          <LinkButton
            href="https://simr.vercel.app/fetch_test"
            target="_blank"
            variant="destructive"
          >
            API test {/* Link to an API test page */}
          </LinkButton>
          <LinkButton
            href={`${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`}
            target="_blank"
            variant="destructive"
          >
            Register {/* Link to the registration test page made by Le */}
          </LinkButton>
        </div>
      </Container>
    </MarketingLayout>
  );
}
