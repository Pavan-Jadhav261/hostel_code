import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/card/Card";

interface Student {
  name: string;
  roomNo: string;
  phoneNo : string;
}

const OutStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOutStudents = async () => {
      try {
        const res = await axios.get("https://hostel-code.onrender.com/outStudents", {
          headers: { token },
        });

        setStudents(res.data.msg || []); 
      } catch (err) {
        console.error(err);
        alert("Failed to fetch out students");
      } finally {
        setLoading(false);
      }
    };

    fetchOutStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  

  return (
    <div className="h-screen w-full p-5">
      <h2 className="text-2xl ml-3">Students out students are</h2>
      <ul>
        {students.map((student, index) => (
          <Card name = {student.name} roomNo={student.roomNo} phoneNo={student.phoneNo}/>
        ))}
      </ul>
      {(students.length === 0)?  <p>No students are currently out.</p>:null}
    </div>
  );
};

export default OutStudents;
