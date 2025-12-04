import { sqlInit } from "@/src/database/sqlInit";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="infraestructura.db" onInit={sqlInit}>
      <Stack />
    </SQLiteProvider>
  );
}
