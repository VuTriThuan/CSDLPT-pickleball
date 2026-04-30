import { useEffect, useState } from "react";

import axios from "axios";

import RevenueTable from "../components/RevenueTable";

function RevenuePage() {
  const [revenues, setRevenues] = useState([]);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  useEffect(() => {
    fetchRevenue();

    fetchTotalRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3005/api/revenue"
      );

      setRevenues(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3005/api/revenue/total"
      );

      setTotalRevenue(
        res.data.data.TongTatCaChiNhanh
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#222",
        }}
      >
        📊 Dashboard Doanh Thu
      </h1>

      {/* card tổng doanh thu */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          width: "350px",
        }}
      >
        <h3
          style={{
            color: "#666",
            marginBottom: "10px",
          }}
        >
          Tổng doanh thu hệ thống
        </h3>

        <h1
          style={{
            color: "#27ae60",
            fontSize: "36px",
          }}
        >
          {totalRevenue.toLocaleString()} VNĐ
        </h1>
      </div>

      {/* bảng doanh thu */}
      <RevenueTable revenues={revenues} />
    </div>
  );
}

export default RevenuePage;