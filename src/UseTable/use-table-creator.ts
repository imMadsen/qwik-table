import { type QRL, type Signal, useTask$ } from "@builder.io/qwik";
import type {
  ColumnDefs,
  SortBy,
  StoreHeaderDef,
  StoreRow,
  TableData,
} from "./types";
import { deriveColumnsFromColumnDefs, deriveHeaders } from "./utils";

/**
 * @summary Contains all the logic for creating table rows and columns.
 */
export const useTableCreator = <TData extends TableData>({
  internalState,
  sortBy,
  data,
  getColumnDefs$,
  fallback,
  rowGroups,
  headerGroups,
}: {
  sortBy: Signal<SortBy | undefined>;
  internalState: Signal<TData[] | undefined | null>;
  data: Signal<TData[] | undefined | null>;
  getColumnDefs$: QRL<() => ColumnDefs<TData>>;
  rowGroups: Signal<StoreRow<TData>[] | undefined>;
  headerGroups: Signal<StoreHeaderDef[] | undefined>;
  fallback: string;
}) => {
  /**
   * Creates arrays of rows and columns.
   */
  useTask$(async ({ track }) => {
    track(() => internalState.value);

    if (!internalState.value || !data.value) {
      return;
    }

    const columnDefs = await getColumnDefs$();

    if (!columnDefs) return;

    const rows: StoreRow<TData>[] = [];

    /**
     * Uses internalState as it can be modified/sorted.
     */
    for (let i = 0; i < internalState.value.length; i++) {
      for (let j = 0; j < columnDefs.length; j++) {
        // A reference to the "row" in the data
        const original = data.value[i];

        const column = deriveColumnsFromColumnDefs(
          columnDefs[j],
          original,
          `${i}-${j}`,
          fallback,
        );

        if (!rows[i]) {
          rows[i] = {
            original,
            cells: [],
          };
        }
        rows[i].cells.push(column)
      }
    }

    const headers = deriveHeaders(columnDefs, sortBy.value);

    rowGroups.value = rows;

    headerGroups.value = headers;
  });
};
