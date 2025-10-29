import { readAppData } from "@/lib/data";
import { notFound } from "next/navigation";
import DesignMixView from "@/components/DesignMixView";

type Design = {
  id: string;
  name: string;
  colors: any[];
};

type Params = {
  params: Promise<{ id: string }>;
};

export default async function DesignPage({ params }: Params) {
  const { id } = await params;
  const { baseColors, designs } = await readAppData();
  const design = designs.find((d: Design) => d.id === id);
  if (!design) return notFound();
  return (
    <DesignMixView baseColors={baseColors} design={design} />
  );
}



