import type { Metadata } from "next";

import Index from "./pdp/_index";

// The Watsco Design Templates index is the home page. It's a client component
// (it uses the design-system Button/Badge, which pull radix into the module
// graph), so metadata lives here on the server route.
export const metadata: Metadata = {
  title: "Watsco Design Templates",
  description: "Directory of every data-driven PDP template.",
};

export default function Home() {
  return <Index />;
}
