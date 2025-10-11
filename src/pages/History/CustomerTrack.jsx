import React from "react";
import TrackTable from "./TrackTable";

const CustomerTrack = () => {
  return (
    <TrackTable
      apiUrl={`${import.meta.env.VITE_API_BASE_URL}/customers/history`}
      title="Customer Activity History"
      columns={["Company", "Staff", "Product", "Action", "Date"]}
    />
  );
};

export default CustomerTrack;
