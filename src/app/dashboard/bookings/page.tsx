import { BookingsPage } from "@/features/demo/dashboard/Placeholders"

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { section } = await searchParams
  return <BookingsPage initialSection={section === "availability" || section === "enquiries" ? section : "calendar"} />
}
