export interface User {
  _id: string;
  name: string;
  email: string;
  role: "researcher" | "admin";
  status: "pending" | "approved" | "rejected";
  token: string;
}

export interface Dataset {
  _id: string;
  title: string;
  author: string;
  experimentType: string;
  tags: string[];
  fileLocation: string;
  createdAt: string;
  uploaderId?: {
    name: string;
    email: string;
  };
}
