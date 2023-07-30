import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './StockList.css'

const StockList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const threadCanRun = process.env.REACT_APP_CAN_RENDER;
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get-stocks/`);
      setRowData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateStockData = async(pageNumber) => {
    try {
      const response = await axios.get(`${baseUrl}/update-stock-data/${pageNumber}/`);
      console.log(`Updating stock data for page Number = ${pageNumber}`);
    } catch(error) {
      console.log(`error in starting stock update for pageNumber = ${pageNumber}`);
    }
  }

  useEffect(() => {
    fetchData();

    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 3000);

    const UpdateDataInterval = setInterval(() => {
      // for(let pageNumber = 1; pageNumber <= 1; pageNumber++){
        updateStockData(1);
      // }
    }, 5000);

   return () => {
      clearInterval(fetchDataInterval);
      clearInterval(UpdateDataInterval);
    };
  }, []);

  const timeAgoFormatter = (params) => {
    if (params.value) {
      const now = new Date();
      const updatedDate = new Date(params.value);
      const diffInMilliseconds = now - updatedDate;

      const seconds = Math.floor(diffInMilliseconds / 1000);

      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
    return '';
  };

  const columnDefs = [
    {headerName: 'Stock Id', field: 'stock_id', sortable:true, filter:true, width:120},
    { headerName: 'Name', field: 'name', width:300 },
    { headerName: 'Price', field: 'price', width:120},
    { headerName: '1hr%', field: 'percent_change_1hr', width:120},
    { headerName: '24hr%', field: 'percent_change_24hr', width:120 },
    { headerName: '7d%', field: 'percent_change_7d', width:120 },
    { headerName: 'Market Cap', field: 'market_cap' },
    { headerName: 'Volume 24h', field: 'volume_24h', width:280 },
    { headerName: 'Current Supply', field: 'current_supply', width:250 },
    { headerName: 'Last Updated', field: 'updated_at', sortable: true, filter: true, valueFormatter: timeAgoFormatter, width:250 },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  return (
    <div className="ag-theme-alpine-dark" style={{ height: '1000px', width: '100%' }}>
        <h1>Crypto Market Data</h1>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default StockList;
