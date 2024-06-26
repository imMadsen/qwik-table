import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { ColumnDefs } from "../UseTable";
import { flexRender, useTable } from "../UseTable";
import styles from "../styles.css?inline";

/**
 * Data the table is derived from
 */
export const mockData = [
  {
    id: "1234",
    firstName: "Reggie",
    lastName: "Watts",
    phone: "555-555-5555",
  },
  {
    id: "2345",
    firstName: "Wendy",
    lastName: "Watts",
    phone: "551-555-5555",
  },
  {
    id: "4321",
    firstName: "Kurt",
    lastName: "Jones",
    phone: "555-255-6555",
  },
];

/**
 * ColumnDefs to select and transform the data above into table data.
 */
export const getColumnDefs$ = $(
  (): ColumnDefs<(typeof mockData)[0]> => [
    {
      accessorKey: "firstName",
      id: "firstName",
      header: "First name",
    },
    {
      accessorKey: "lastName",
      id: "lastName",
      header: "Last name",
    },
    {
      accessorKey: "phone",
      id: "phone",
      header: "Phone",
    },
  ],
);

export default component$(() => {
  useStyles$(styles);

  const data = useSignal(mockData);

  const table = useTable({ data, getColumnDefs$, fallback: "--" });

  return (
    <div>
      <table>
        <thead>
          <tr>
            {table.headerGroups.value?.map((header) => (
              <td key={header.id}>{flexRender(header.cell)}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rowGroups.value?.map((row, i) => (
            <tr key={i + "row"}>
              {row.cells.map((cell) => (
                <td key={cell.id}>
                  <div data-test-id={cell.value}>{flexRender(cell.cell)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
