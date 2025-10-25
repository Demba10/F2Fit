import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const getFormattedDate = () => {
  const today = new Date("2025-10-24");
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getCellValue = (row, column) => {
  const accessorKey = column.accessorKey;
  if (!accessorKey) return '';
  
  // Try to get a simple value first
  const value = accessorKey.split('.').reduce((o, i) => (o ? o[i] : undefined), row);

  // If a cell renderer is provided, try to get a more specific value.
  if (column.cell) {
    try {
      const cellContent = column.cell({ row: row.original || row });

      // If cell renderer returns a simple value
      if (['string', 'number', 'boolean'].includes(typeof cellContent)) {
        return cellContent;
      }
      
      // If the cell content is an object with a 'text' property (custom for export)
      if (typeof cellContent === 'object' && cellContent !== null && 'text' in cellContent) {
          return cellContent.text;
      }

      // If it's a React element, try to extract text from it
      if (React.isValidElement(cellContent)) {
        const getText = (element) => {
          if (!element) return '';
          if (typeof element === 'string') return element;
          if (element.props && typeof element.props.children === 'string') {
            return element.props.children;
          }
          if (Array.isArray(element.props.children)) {
            return element.props.children.map(child => getText(child)).join('');
          }
          return '';
        };
        const extractedText = getText(cellContent);
        if (extractedText) return extractedText;
      }
    } catch (e) {
      // If rendering fails, fall back to the simple value
      return value !== undefined && value !== null ? String(value) : '';
    }
  }

  return value !== undefined && value !== null ? String(value) : '';
};

export const exportData = (format, data, columns, fileNamePrefix, pageTitle) => {
  const date = getFormattedDate();
  const fileName = `${fileNamePrefix}_export_${date}`;

  // Filter out columns without headers or with only actions
  const exportableColumns = columns.filter(col => col.header && col.accessorKey !== 'actions');
  const headers = exportableColumns.map(col => col.header);

  const body = data.map(row => 
    exportableColumns.map(col => getCellValue(row, col))
  );

  if (format === 'xlsx' || format === 'csv') {
    const worksheetData = data.map(row => {
      let rowData = {};
      exportableColumns.forEach(col => {
        rowData[col.header] = getCellValue(row, col);
      });
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.${format === 'xlsx' ? 'xlsx' : 'csv'}`);
  }

  if (format === 'pdf') {
    const doc = new jsPDF();
    doc.text(pageTitle, 14, 15);
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [239, 68, 68], // A shade of red
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      }
    });
    doc.save(`${fileName}.pdf`);
  }
};