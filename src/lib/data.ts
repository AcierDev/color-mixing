import { promises as fs } from "fs";
import path from "path";

type BaseColor = {
  id: string;
  name: string;
};

type DesignColor = {
  id: string;
  label: string;
  formula: string;
};

type Design = {
  id: string;
  name: string;
  colors: DesignColor[];
};

type AppData = {
  baseColors: BaseColor[];
  designs: Design[];
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

export async function readBaseColors(): Promise<BaseColor[]> {
  const file = path.join(DATA_DIR, "baseColors.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as BaseColor[];
}

export async function readDesigns(): Promise<Design[]> {
  const file = path.join(DATA_DIR, "designs.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Design[];
}

export async function readAppData(): Promise<AppData> {
  const [baseColors, designs] = await Promise.all([
    readBaseColors(),
    readDesigns(),
  ]);
  return { baseColors, designs };
}



