"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  calculateArea,
  calculateVolume,
  calculateMaterials,
} from "@/lib/utils";
import Weather from "./Weather";

export default function PotholeSheet() {
  const params = useParams();
  const jobId = params.id as string; // Get ID from URL params
  const router = useRouter();

  const [dimensions, setDimensions] = useState({ l: 0, w: 0, d: 0 });
  const [bags, setBags] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calculate derived values
  const area = calculateArea(dimensions.l, dimensions.w);
  const volume = calculateVolume(dimensions.l, dimensions.w, dimensions.d);
  const materials = calculateMaterials(bags);
  const [weather, setWeather] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Client-side validation
      if (dimensions.l <= 0 || dimensions.w <= 0 || dimensions.d <= 0) {
        throw new Error("All dimensions must be greater than 0");
      }
      if (bags <= 0) {
        throw new Error("Number of cement bags must be at least 1");
      }

      const response = await fetch("/api/potholes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: jobId,
          dimensions,
          area: area,
          volume: volume,
          materialsInKg: materials,
          numberOfBags: bags,
          weather: weather,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create pothole report");
      }

      // Handle successful submission
      setSuccess(true);
      setTimeout(() => router.push(`/user/jobs/${jobId}`), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Weather onWeatherChange={(weatherDesc) => setWeather(weatherDesc)} />
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="space-y-6">
          {/* Status Indicators */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              ✅ Report created successfully! Redirecting...
            </div>
          )}

          {/* Dimensions Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pothole Dimensions (meters)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Length", "Width", "Depth"].map((label, index) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        [index === 0 ? "l" : index === 1 ? "w" : "d"]:
                          parseFloat(e.target.value),
                      })
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Materials Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Materials Used
            </h2>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cement Bags (25kg each)
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setBags(Math.max(1, parseInt(e.target.value)) || 1)
                }
                placeholder="Enter number of bags"
              />
            </div>
          </div>

          {/* Calculations Dashboard */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Calculated Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Surface Area</p>
                <p className="text-xl font-bold text-blue-600">
                  {area.toFixed(2)} m²
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Volume</p>
                <p className="text-xl font-bold text-blue-600">
                  {volume.toFixed(2)} m³
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Total Cement</p>
                <p className="text-xl font-bold text-blue-600">
                  {materials} kg
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}>
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? "Submitting..." : "Save Pothole Sheet"}
          </button>
        </div>
      </form>
    </>
  );
}
