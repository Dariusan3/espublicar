import { redirect } from "next/navigation";

/** Old English route kept alive for bookmarks and links already shared. */
export default function Page() {
  redirect("/mi-cuenta");
}
