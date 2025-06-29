import React, { useState } from "react";
import CustomButton from "../button";
import InputBox from "../input";
import "./style.css";
import * as XLSX from "xlsx";

function DataTable(props) {
  const [isFilter, setIsFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const data = Array.isArray(props.data) ? props.data : [];

  const truncateHTML = (html, length) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    return textContent.length > length
      ? textContent.substring(0, length) + "..."
      : textContent;
  };

  const handleFilterChange = (e, column) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const handleSort = (column) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === column &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, props.title);
    XLSX.writeFile(workbook, `${props.title}.xlsx`, { compression: true });
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on rows per page change
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((column) => {
      return String(row[column])
        .toLowerCase()
        .includes(filters[column].toLowerCase());
    });
  });

  const sortedData = filteredData.sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
    if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div
      style={{ border: "1px solid rgb(203 211 232)", borderRadius: 8 }}
      className="bg-white rounded-md overflow-auto"
    >
      <div
        className="bg-background p-5 flex items-center justify-start flex-col lg:flex-row lg:justify-between"
        style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      >
        <div className="w-full">
          <h3 className="font-medium text-xl">{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <div className="flex gap-2 w-full mt-4 flex-col lg:w-96 lg:mt-0 sm:flex-row">
          {props.allow_download && (
            <CustomButton label="Download" onClick={handleDownload} />
          )}
          {props.addButton && (
            <CustomButton label={props.addBtnLabel} onClick={props.addButton} />
          )}
          {props.secButton && (
            <CustomButton label={props.secBtnLabel} onClick={props.secButton} />
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <InputBox margin={0} width={"w-80"} placeholder="Search..." />
          <i
            onClick={() => setIsFilter(!isFilter)}
            className="bg-background rounded bx bx-filter-alt bx-sm cursor-pointer"
            style={{ padding: 11, color: "#575656" }}
          ></i>
          <div className="ml-auto flex flex-col gap-4 w-full">
            {props.tabletopElement}
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgb(227 231 242)",
            overflow: "auto",
            marginTop: 20,
            borderRadius: 8,
          }}
        >
          <table className="data-table w-full overflow-auto">
            <thead>
              <tr>
                <th>S. No</th>
                {props.headers.map((column, i) => (
                  <th key={column}>
                    <div className="flex items-center justify-center gap-1">
                      <span>{column}</span>
                      {column !== "S. No" && (
                        <button onClick={() => handleSort(props.fields[i])}>
                          <i
                            style={{ color: "rgb(74 74 74)" }}
                            className="bx bx-sort"
                          ></i>
                        </button>
                      )}
                    </div>
                    {isFilter && (
                      <input
                        type="text"
                        placeholder={`Filter ${column}`}
                        value={filters[props.fields[i]] || ""}
                        onChange={(e) => handleFilterChange(e, props.fields[i])}
                        className="w-full mt-2 text-sm outline-none p-2 mb-1 rounded font-medium"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr
                  className="cursor-pointer"
                  key={index}
                  onClick={props.onAction ? () => props.onAction(row) : null}
                >
                  <td style={{ textAlign: props.align }}>
                    {indexOfFirstRow + index + 1}
                  </td>
                  {props.fields.map((item, i) => {
                    if (item === true || item === "true") {
                      return (
                        <td key={`${index}-${i}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 🔒 Prevent row click
                              props.fieldButton(row);
                            }}
                          >
                            <i
                              className="bx bx-edit-alt bx-sm bx-tada-hover"
                              style={{ color: "#434343" }}
                            ></i>
                          </button>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          style={{ textAlign: props.align }}
                          className="w-max"
                          key={`${index}-${i}`}
                          dangerouslySetInnerHTML={{
                            __html: truncateHTML(row[item], 80),
                          }}
                        ></td>
                      );
                    }
                  })}

                  {/* {props.fields.map((item, i) => (
                    <td
                      style={{ textAlign: props.align }}
                      className="w-max"
                      key={`${index}-${i}`}
                      dangerouslySetInnerHTML={{
                        __html: truncateHTML(row[item], 80),
                      }}
                    ></td>
                  ))} */}
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={props.headers.length + 1}>No Records Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span>
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </span>
          <div className="flex gap-2 items-start">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bx bx-chevron-left bx-sm"></i>
            </button>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bx bx-chevron-right bx-sm"></i>
            </button>
            <div>
              <label htmlFor="rowsPerPage">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
