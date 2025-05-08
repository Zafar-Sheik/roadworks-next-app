"use client";
import { useState } from "react";

// Type definitions
type Dimensions = {
  length: string;
  width: string;
  depth: string;
};

type Materials = {
  bags: string;
  kg: number;
};

type Signature = {
  name: string;
  signature: string;
  date: string;
};

interface MeasurementRow {
  date: string;
  location: string;
  dimensions: Dimensions;
  materials: Materials;
  weather: string;
}

interface Metrics {
  area: string;
  volume: string;
  kg: string;
}

interface MeasurementRowProps {
  row: MeasurementRow;
  rowIndex: number;
  metrics: Metrics;
  onChange: (rowIndex: number, path: string, value: string) => void;
}

interface SignatureSectionProps {
  role: "contractor" | "engineer";
  signature: Signature;
  onChange: (signature: Signature) => void;
}

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string;
  onChange: (value: string) => void;
}

// Initial values
const initialRow: MeasurementRow = {
  date: "",
  location: "",
  dimensions: { length: "", width: "", depth: "" },
  materials: { bags: "", kg: 0 },
  weather: "",
};

const initialSignature: Signature = {
  name: "",
  signature: "",
  date: "",
};

// Main component
export default function PotholeSheet() {
  const [rows, setRows] = useState<MeasurementRow[]>(() =>
    Array(3)
      .fill(initialRow)
      .map((r) => ({ ...r }))
  );
  const [signatures, setSignatures] = useState<{
    contractor: Signature;
    engineer: Signature;
  }>({
    contractor: { ...initialSignature },
    engineer: { ...initialSignature },
  });

  const calculateMetrics = (dimensions: Dimensions, bags: string): Metrics => {
    const toFloat = (n: string): number => parseFloat(n) || 0;
    const [l, w, d] = [
      toFloat(dimensions.length),
      toFloat(dimensions.width),
      toFloat(dimensions.depth),
    ];
    const bagCount = toFloat(bags);

    return {
      area: (l * w).toFixed(2),
      volume: (l * w * d).toFixed(2),
      kg: (bagCount * 25).toFixed(1),
    };
  };

  const updateRow = (rowIndex: number, path: string, value: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? updateNestedField(row, path, value) : row
      )
    );
  };

  return (
    <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
      <header className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">
          🛠️ Pothole Repair Tracker
        </h1>
      </header>

      <div className="overflow-x-auto p-4">
        <table className="w-full table-fixed">
          <TableHeader />
          <tbody>
            {rows.map((row, i) => (
              <MeasurementRow
                key={i}
                row={row}
                rowIndex={i}
                metrics={calculateMetrics(row.dimensions, row.materials.bags)}
                onChange={updateRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 border-t">
        <SignatureSection
          role="contractor"
          signature={signatures.contractor}
          onChange={(sig) =>
            setSignatures((prev) => ({ ...prev, contractor: sig }))
          }
        />
        <SignatureSection
          role="engineer"
          signature={signatures.engineer}
          onChange={(sig) =>
            setSignatures((prev) => ({ ...prev, engineer: sig }))
          }
        />
      </div>
    </div>
  );
}

// Helper components
const TableHeader = () => (
  <thead className="bg-gray-100">
    <tr>
      {[
        "Date",
        "Location",
        "Dimensions (m)",
        "Area m²",
        "Volume m³",
        "Materials",
        "Weather",
      ].map((header) => (
        <th
          key={header}
          className="p-3 text-left text-sm font-medium text-gray-500 uppercase">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const MeasurementRow: React.FC<MeasurementRowProps> = ({
  row,
  rowIndex,
  metrics,
  onChange,
}) => (
  <tr className="border-t hover:bg-gray-50 even:bg-gray-50/50">
    <td className="p-3">
      <Input
        type="date"
        value={row.date}
        onChange={(v) => onChange(rowIndex, "date", v)}
      />
    </td>

    <td className="p-3">
      <Input
        value={row.location}
        placeholder="Enter location"
        onChange={(v) => onChange(rowIndex, "location", v)}
      />
    </td>

    <td className="p-3">
      <div className="flex gap-2">
        {(Object.keys(row.dimensions) as (keyof Dimensions)[]).map((dim) => (
          <Input
            key={dim}
            type="number"
            className="w-20"
            placeholder={dim[0].toUpperCase()}
            value={row.dimensions[dim]}
            onChange={(v) => onChange(rowIndex, `dimensions.${dim}`, v)}
          />
        ))}
      </div>
    </td>

    <td className="p-3 font-mono">{metrics.area}</td>
    <td className="p-3 font-mono">{metrics.volume}</td>

    <td className="p-3">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          className="w-16"
          value={row.materials.bags}
          onChange={(v) => onChange(rowIndex, "materials.bags", v)}
        />
        <span className="text-gray-500">→</span>
        <span className="font-mono">{metrics.kg}kg</span>
      </div>
    </td>

    <td className="p-3">
      <Input
        value={row.weather}
        placeholder="Sunny"
        onChange={(v) => onChange(rowIndex, "weather", v)}
      />
    </td>
  </tr>
);

const SignatureSection: React.FC<SignatureSectionProps> = ({
  role,
  signature,
  onChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-700 capitalize">
      {role}'s Sign-off
    </h3>
    <Input
      placeholder={`${role} Name`}
      value={signature.name}
      onChange={(v) => onChange({ ...signature, name: v })}
    />
    <Input
      placeholder="Signature"
      value={signature.signature}
      onChange={(v) => onChange({ ...signature, signature: v })}
    />
    <Input
      type="date"
      value={signature.date}
      onChange={(v) => onChange({ ...signature, date: v })}
    />
  </div>
);

// Utility components
const Input: React.FC<InputProps> = ({
  type = "text",
  className = "",
  onChange,
  ...props
}) => (
  <input
    type={type}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${className}`}
    onChange={(e) => onChange(e.target.value)}
    {...props}
  />
);

// Helper function with proper typing
function updateNestedField<T extends Record<string, any>>(
  obj: T,
  path: string,
  value: string
): T {
  const [root, nested] = path.split(".") as [keyof T, string?];

  return nested
    ? { ...obj, [root]: { ...obj[root], [nested]: value } }
    : { ...obj, [root]: value };
}
