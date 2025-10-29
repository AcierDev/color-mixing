import Link from "next/link";
import { readAppData } from "@/lib/data";

type Design = {
  id: string;
  name: string;
  colors: any[];
};

export default async function Home() {
  const { designs } = await readAppData();
  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Color Mixing Calculator
        </h1>
        <p className="text-gray-600 text-sm">
          Professional paint and pigment mixing tool
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {designs.map((d: Design) => (
          <Link
            key={d.id}
            href={`/design/${d.id}`}
            className="group block rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            <div className="font-semibold text-gray-900 group-hover:text-black transition-colors">
              {d.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {d.colors.length} colors
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
