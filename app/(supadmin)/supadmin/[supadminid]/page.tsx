"use client";

import { useParams } from "next/navigation";

const SupAdminPage = () => {
  const params = useParams();
  const { supadminid } = params;

  return (
    <div>
      <h1>Super Admin Page</h1>
      <p>Admin ID: {supadminid || "Loading..."}</p>
    </div>
  );
};

export default SupAdminPage;