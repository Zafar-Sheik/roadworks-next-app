export const FORMULAS = {
  PAINT: (inputs: any) => inputs.area * inputs.coverageRate,
  POTHOLE: (inputs: any) => inputs.volume * inputs.materialCost,
};

export const calculateOutputs = (formulaKey: string, inputs: any) => {
  const formula = FORMULAS[formulaKey as keyof typeof FORMULAS];
  if (!formula) throw new Error("Invalid formula");
  return formula(inputs);
};
