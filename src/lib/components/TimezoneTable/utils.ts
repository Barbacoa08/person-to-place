import type { TableData } from "$types/Store";

export const tableSort = (
  a: TableData,
  b: TableData,
  orderBy?: keyof TableData,
  direction?: "asc" | "desc",
) => {
  if (!orderBy || !direction) return 0;

  if (direction === "asc") {
    if (a[orderBy] < b[orderBy]) return -1;
    else if (a[orderBy] > b[orderBy]) return 1;
    else return 0;
  } else if (direction === "desc") {
    if (a[orderBy] < b[orderBy]) return 1;
    else if (a[orderBy] > b[orderBy]) return -1;
    else return 0;
  } else {
    console.error("Invalid direction", { a, b, orderBy, direction });
    throw new Error("Invalid direction");
  }
};
