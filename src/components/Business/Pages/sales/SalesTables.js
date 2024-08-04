import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusSlashMinus,
  FilePdf,
  Link45deg,
  Check,
  ChevronLeft, ArrowDown, ArrowUp, Person,
} from "react-bootstrap-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Progress from "./Progress";
import ContactSales from "./ContactSales";
import SalesNote from "./SalesNote";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import Button from "react-bootstrap/Button";
import QuoteLost from "./QuoteLost";
import QuoteWon from "./QuoteWon";
import ActionsDots from "./ActionsDots";

import { Table } from "react-bootstrap";
import TableTopBar from "./TableTopBar";
import { Resizable } from 'react-resizable';

const SalesTables = ({ profileData, salesData, fetchData }) => {
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [salesDataState, setSalesDataState] = useState([]);
  const [rows, setRows] = useState([]);
  // Formate Date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
  };

  const toggleSort = (field) => {
    setSortField(field);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const sortedSalesData = [salesData && salesData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  const removeRow = () => {
    fetchData()
  };

  const refreshData = () => {
    fetchData()
  }

  const createSalesNote = (noteData, saleUniqueId) => (
    <>
      <SalesNote noteData={noteData} saleUniqueId={saleUniqueId} />
    </>
  );

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAllCheckboxChange = () => {
    const allRowIds = salesData && salesData.length && salesData.map((sale) => sale.id);
    if (selectedRows.length === allRowIds.length) {

      setSelectedRows([]);
    } else {

      setSelectedRows(allRowIds);
    }
  };

  const selectedRowsCount = selectedRows.length;

  const [columns, setColumns] = useState([
    {
      field: "Quote",
      width: 70,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
          <span>Quote</span>
          {sortField === "Quote" && (
            <span>
              {sortDirection === "asc" ? (
                <ArrowUp size={16} color="#475467" />
              ) : (
                <ArrowDown size={16} color="#475467" />
              )}
            </span>
          )}
        </div>
      ),

      renderCell: (params) => (
        <div className="styleColor1">
          <strong>{params.value.substring(4)}</strong>
          <p>{formatDate(params.row.created)}</p>
        </div>
      ),
    },

    {
      field: "Client",
      width: 400,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Client")}>
          <span>Client</span>
          {sortField === "Client" && (
            <span>
              {sortDirection === "asc" ? (
                <ArrowUp size={16} color="#475467" />
              ) : (
                <ArrowDown size={16} color="#475467" />
              )}
            </span>
          )}
        </div>
      ),

      renderCell: (params) => (
        <div className="userImgStyle">
          <div className="innerFlex styleColor2 d-flex justify-content-between">
            <div className="leftStyle d-flex align-items-center">
              <img className={params.row.hasPhoto ? "truePhotoStyle" : "falsePhotoStyle"}
                src={params.row.photo}
                alt={params.row.photo}
                style={{ marginRight: "5px" }}
              />
              <span>{params.value}</span>
            </div>
            <Button className="linkByttonStyle" variant="link">Open</Button>
          </div>
        </div>
      ),

    },
    {
      field: "Reference",
      sortable: false,
      headerName: "Reference",
      renderCell: (params) => (
        <div
          className="mainStyle mainStyleMin"
          style={{ whiteSpace: "normal", textAlign: "left" }}
        >
          Proj-{params.row.id} | {params.value}
        </div>
      ),
    },
    {
      field: "Status",
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
          <span>Status</span>
          {sortField === "Status" && (
            <span>
              {sortDirection === "asc" ? (
                <ArrowUp size={16} color="#475467" />
              ) : (
                <ArrowDown size={16} color="#475467" />
              )}
            </span>
          )}
        </div>
      ),
      width: 118,
      renderCell: (params) => (
        <div className={`statusInfo ${params.value}`}>
          <Link to="/">{params.value}</Link>
        </div>
      ),
    },
    {
      field: "Calculation",
      sortable: false,
      headerName: "Calculation",
      width: 147,
      renderCell: (params) => (
        <div>
          <ul className="disPlayInline disPlayInlineCenter">
            <li className="disable">
              <PlusSlashMinus color="#FDB022" size={16} />
            </li>
            <li>
              <Link to={params.row.CalculationPDF}>
                <FilePdf color="#FF0000" size={16} />
              </Link>
            </li>
            <li>
              <Link to={params.row.CalculationURL}>
                <Link45deg color="#3366CC" size={16} />
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
    {
      field: "Note",
      sortable: false,
      headerName: "Note",
      width: 94,
      renderCell: (params) => <div>{params.value}</div>,
    },
    {
      field: "User",
      sortable: false,
      headerName: "User",
      width: 56,
      renderCell: (params) => (
        <div>
          <div className="circleImgStyle">
            {["top-start"].map((placement) => (
              <OverlayTrigger
                key={placement}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>
                    <div className="tooltipBox">{params.row.fullName}</div>
                  </Tooltip>
                }
              >
                <span variant="light" className="">
                  {params.value ? (
                    <>
                      {params.value}
                    </>
                  ) : (
                    <div className="iconPerson">
                      <Person size={24} color="#667085" />
                    </div>
                  )}

                </span>
              </OverlayTrigger>
            ))}
          </div>
        </div>
      ),
    },
    {
      field: "Contact",
      sortable: false,
      headerName: "Contact",
      width: 183,
      renderCell: (params) => (
        <div>
          <ContactSales type={params.value} saleUniqueId={params.row.saleUniqueId} refreshData={refreshData} />
        </div>
      ),
    },
    {
      field: "Progress",
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Progress")}>
          <span>Progress</span>
          {sortField === "Progress" && (
            <span>
              {sortDirection === "asc" ? (
                <ArrowUp size={16} color="#475467" />
              ) : (
                <ArrowDown size={16} color="#475467" />
              )}
            </span>
          )}
        </div>
      ),

      width: 232,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <Progress
            progressName1={params.row.progressName}
            progressPercentage1={params.row.progressPercentage} salesUniqId1={params.row.saleUniqueId} onRemoveRow={removeRow}
          />
        </div>
      ),
    },

    {
      field: "W",
      sortable: false,
      headerName: "Lost / Won",
      width: 106,
      renderCell: (params) => (
        <div>
          <div className="styleActionBtn">
            <QuoteLost
              size={16}
              color="#D92D20"
              LostQuote={params.row.LostQuote}
              saleUniqueId={params.row.saleUniqueId}
              saleId={params.row.id}
              onRemoveRow={removeRow}
              fetchData1={setRows}
              salesData={salesDataState}
              quoteType="lost"
            />
            <QuoteWon
              size={16}
              color="#079455"
              wonQuote={params.row.wonQuote}
              saleUniqueId={params.row.saleUniqueId}
              saleId={params.row.id}
              onRemoveRow={removeRow}
              fetchData1={setRows}
              salesData={salesDataState}
              quoteType="won"
            />
          </div>
        </div>
      ),
    },
    {
      field: "Actions",
      sortable: false,
      headerName: "Actions",
      width: 72,
      className: "ActionBtn",
      renderCell: (params) => (
        <ActionsDots saleUniqueId={params.row.saleUniqueId} refreshData={refreshData} />
      ),
    },
  ]);

  useEffect(() => {
    setSalesDataState([...salesData]);
  }, [salesData]);

  useEffect(() => {

    const rows = salesData.map((sale) => ({
      isSelected: selectedRows.includes(sale.id),
      id: sale.id,
      Quote: sale.number,
      created: sale.created,
      Client: sale.client.name,
      photo: sale.client.photo,
      hasPhoto: sale.client.has_photo,
      Reference: sale.reference,
      Status: sale.status,
      Calculation: sale.calculation,
      CalculationPDF: sale.quote_url,
      CalculationURL: sale.unique_url,
      Note: createSalesNote(sale.sales_note, sale.unique_id),
      User: sale.manager.alias_name,
      fullName: sale.manager.full_name,
      Contact: sale.sales_contacts,
      progressName: sale.lead.name,
      progressPercentage: sale.lead.percentage,
      saleUniqueId: sale.unique_id,
      wonQuote: sale.number,
      LostQuote: sale.number,
      amountData: sale.amount,
      Actions: "Actions",
    }));
    setRows(rows)
  }, [salesData, selectedRows])



  const onResize = (index) => (event, { size }) => {
    setColumns((prevColumns) => {
      const nextColumns = [...prevColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };


  const handleCheckboxChange = (rowId) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowId)) {
      // Row is already selected, remove it
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowId), 1);

    } else {
      // Row is not selected, add it
      updatedSelectedRows.push(rowId);
    }
    setSelectedRows(updatedSelectedRows);
  };

  // Define selected1UniqueIds as a function that returns the selected unique IDs
  const selected1UniqueIds = () => {
    // Get the unique_id of the selected rows
    const selectedUniqueIds = salesData
      .filter(row => selectedRows.includes(row.id))
      .map(row => row.unique_id);
    return selectedUniqueIds;
  };

  const isSelected = selectedRows.length > 0;
  const [rowsfilter, setRowsFilter] = useState([]);
  const handleRowsFilterChange = (filteredRows) => {
    const rows = filteredRows.map((sale) => ({
      isSelected: selectedRows.includes(sale.id),
      id: sale.id,
      Quote: sale.number,
      created: sale.created,
      Client: sale.client.name,
      photo: sale.client.photo,
      Reference: sale.reference,
      Status: sale.status,
      Calculation: sale.calculation,
      CalculationPDF: sale.quote_url,
      CalculationURL: sale.unique_url,
      Note: createSalesNote(sale.sales_note, sale.unique_id),
      User: sale.manager.alias_name,
      fullName: sale.manager.full_name,
      Contact: sale.sales_contacts,
      progressName: sale.lead.name,
      progressPercentage: sale.lead.percentage,
      saleUniqueId: sale.unique_id,
      wonQuote: sale.number,
      LostQuote: sale.number,
      amountData: sale.amount,
      Actions: "Actions",
    }));
    setRows(rows);
    setRowsFilter(rows);
  };


  return (
    <div className="salesTableWrap">
      <TableTopBar profileData={profileData} salesData={salesData} rowsfilter={rowsfilter} removeRowMulti={removeRow} selectedUniqueIds={selected1UniqueIds()} onRowsFilterChange={handleRowsFilterChange} rows={sortedSalesData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />
      <Table responsive>
        <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
          <tr>
            <th>
              <label className="customCheckBox">
                <input
                  type="checkbox"
                  checked={selectedRows.length === salesData.length}
                  onChange={handleSelectAllCheckboxChange}
                />
                <span className="checkmark">
                  <Check color="#1AB2FF" size={20} />
                </span>
              </label>
            </th>
            {columns.map((column, index) => (
              <th key={column.field} style={{ width: column.width }}>
                <Resizable
                  width={column.width || 100} // Provide a default width if undefined
                  height={0}
                  onResize={onResize(index)}
                >
                  <div>
                    {column.headerName}
                  </div>
                </Resizable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="nodataTableRow">
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <div
                    className="Nodata"
                    style={{ background: `url(${nodataBg})` }}
                  >
                    <div className="image">
                      <img src={NodataImg} alt="NodataImg" />
                      <img
                        className="SearchIcon"
                        src={SearchIcon}
                        alt="SearchIcon"
                      />
                    </div>
                    <h2>There is no results</h2>
                    <p>
                      The user you are looking for doesn't exist. Here are some
                      helpful links:
                    </p>
                    <Button className="gobackButton mb-4 mt-4" variant="link">
                      {" "}
                      <ChevronLeft color="#000" size={20} />
                      Go back
                    </Button>
                    <Button className="gobackSupport mt-4" variant="link">
                      {" "}
                      Support
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr data-saleuniqueid={row.saleUniqueId}
                key={row.id} className={row.isSelected ? "selected-row" : ""}>
                <td>
                  <label className="customCheckBox">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                    <span className="checkmark">
                      <Check color="#1AB2FF" size={20} />
                    </span>
                  </label>
                </td>
                {columns.map((column) => (
                  <td key={column.field}>
                    {column.renderCell({ value: row[column.field], row })}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SalesTables
