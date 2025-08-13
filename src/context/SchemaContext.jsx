import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SchemaContext = createContext();

export function SchemaProvider({ children }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/schema`)
      .then((res) => {
        if (res.data.success) {
          setSchema(res.data.schema);
        } else {
          setMessage("Failed to load schema");
        }
      })
      .catch(() => {
        setMessage("Failed to load schema");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SchemaContext.Provider value={{ schema, loading, message }}>
      {children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  return useContext(SchemaContext);
}
