import { useEffect, useState } from "react";
import axios from "axios";

const OutStudents = () => {
  const [response, setResponse] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOutStudents = async () => {
      try {
        const res = await axios.get("https://hostel-code.onrender.com/outStudents", {
          headers: { token },
        });
console.log(res)
       
        setResponse(res.data.msg); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchOutStudents();
  }, []);

  return (
    <div>
      {response.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
};

export default OutStudents;
