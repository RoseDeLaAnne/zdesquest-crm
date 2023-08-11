import React, { useEffect, useState } from "react";
import axios from "axios";

interface DataItem {
  id: number;
  quest_address: string;
  quest_name: string;
}

export function Quests() {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    axios
      .get<DataItem[]>("http://127.0.0.1:8000/api/quests/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div>
        {data.map((item) => (
          <div key={item.id}>{item.quest_name}</div>
        ))}
      </div>
    </>
  );
}