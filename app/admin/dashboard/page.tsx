// app/admin/dashboard/page.tsx - UPDATED WITH GOOGLE SHEETS SYNC

"use client";

import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import { useSyncAllToSheets } from "@/app/lib/hooks/useGoogleSheets";

// ... existing imports and types ...

export default function AdminDashboard() {
  // ... existing state ...

  // Google Sheets sync
  const syncMutation = useSyncAllToSheets();

  // ... existing code ...

  const handleSyncToSheets = async () => {
    if (!confirm("Đồng bộ tất cả dữ liệu lên Google Sheets?")) return;

    try {
      await syncMutation.mutateAsync();
      alert("✅ Đã đồng bộ thành công lên Google Sheets!");
    } catch (error: any) {
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* ... existing header ... */}

      {/* ... existing stats cards ... */}

      {/* Filters Bar - ADD SYNC BUTTON */}
      <div className={styles.filtersBar}>
        <div className={styles.tabsContainer}>
          {/* ... existing tabs ... */}
        </div>

        <div className={styles.filterGroup}>
          {/* ... existing filters ... */}

          {/* EXPORT CSV BUTTON */}
          <button
            className={styles.exportButton}
            onClick={() => {
              /* existing export logic */
            }}
          >
            📥 Export CSV
          </button>

          {/* NEW: GOOGLE SHEETS SYNC BUTTON */}
          <button
            className={styles.syncSheetsButton}
            onClick={handleSyncToSheets}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending ? (
              <>
                <span className={styles.spinner}></span>
                Đang đồng bộ...
              </>
            ) : (
              <>📊 Sync Google Sheets</>
            )}
          </button>
        </div>
      </div>

      {/* ... existing table and pagination ... */}
    </div>
  );
}
