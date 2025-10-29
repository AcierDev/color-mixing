export type BaseColor = {
  id: string;
  name: string;
};

export type DesignColor = {
  id: string; // sequence id within design
  label: string;
  formula: string; // human readable
};

export type Design = {
  id: string;
  name: string;
  colors: DesignColor[];
};

export type AppData = {
  baseColors: BaseColor[];
  designs: Design[];
};

