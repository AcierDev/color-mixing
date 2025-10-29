import Link from "next/link";
import { readAppData } from "@/lib/data";

export default async function Home() {
  const { designs } = await readAppData();
  return (
    <main className="mx-auto max-w-md p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">Select a design</h1>
      <ul className="space-y-2">
        {designs.map((d) => (
          <li key={d.id}>
            <Link
              href={`/design/${d.id}`}
              className="block rounded-lg border border-zinc-200 px-4 py-3 active:scale-[0.99]"
            >
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
