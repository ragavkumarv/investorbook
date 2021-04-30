import React from "react";

export const EmployeeFormatter = ({ row }) => 
  {
  return <div
    style={{
      display: "flex",
      gap: "14px",
      alignItems: "flex-start",
      placeContent:'center flex-start',
      flexWrap : 'wrap'
    }}
  >
    {row.photo_thumbnail || 'investments' in row ? <div>
      <img
        src={row.photo_thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACGFpr0iqURE_6EHYMm-AGXfhXC1Nzf4ucA&usqp=CAU"}
        style={{
          height: "38px",
          width: "38px",
          borderRadius: "50%",
          margin: "0 auto",
        }}
        alt="Avatar" />
    </div> : ''}
    {row.name}
  </div>
};
