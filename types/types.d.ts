declare global {
  interface User {
    _id: string;
    email: string;
    password: string;
    role: "admin" | "laborer";
    company: "CompanyA" | "CompanyB";
    createdAt: Date;
  }

  interface JobSheet {
    user: string;
    jobType: string;
    inputs: Array<{ name: string; value: number; unit: string }>;
    outputs: Array<{ name: string; value: number; unit: string }>;
    company: "CompanyA" | "CompanyB";
    timestamp: Date;
  }
}
