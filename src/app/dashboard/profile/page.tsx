import { redirect } from "next/navigation"

// The old "Profile" screen is now the "Content" tab of My page.
export default function Page() {
  redirect("/dashboard/page")
}
