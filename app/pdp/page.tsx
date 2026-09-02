import { redirect } from "next/navigation";

// The templates index lives only on the home route now. Any remaining link to
// /pdp lands on home; the product pages at /pdp/<slug> are unaffected.
export default function PdpIndexRedirect() {
  redirect("/");
}
