import { useState } from 'react'
import axios from "axios";
import * as XLSX from 'xlsx';


function App() {
 const [msg, setMsg] = useState('')
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

 function handlemsg(event) 
 {
    setMsg(event.target.value)
 }

 function handlefile(event)
 {
   const file=event.target.files[0]
   console.log(file);

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const SheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[SheetName];
        const emailList = XLSX.utils.sheet_to_json(worksheet, {header: "A" });
        const totalemail = emailList.map(function(item) {
          return item.A;
        })
        console.log(totalemail);
        setEmailList(totalemail);
    };

    reader.readAsArrayBuffer(file);

 }

const API = import.meta.env.VITE_BACKEND_URL;


const Send = () => {
  setstatus(true);

  axios.post(`${API}/sendmail`, { msg, emailList })
    .then((res) => {
      if (res.data.success === true) {
        alert("Email sent successfully");
      } else {
        alert("Failed to send emails");
      }
      setstatus(false);
    })
    .catch((err) => {
      console.error(err);
      alert("Error occurred");
      setstatus(false);
    });
};



  return (
    <div>
      <div className='bg-blue-950 text-white text-center '>
        <h1 className='font-medium px-5 py-3 text-xl'>BulkMail</h1>
      </div>
      <div className='bg-blue-900 text-white text-center '>
        <h1 className='font-medium px-5 py-3'>We can help your business with sending multiple emails at once</h1>
      </div>
      <div className='bg-blue-800 text-white text-center '>
        <h1 className='font-medium px-5 py-3'>Drag and Drop</h1>
      </div>

      <div className='bg-blue-600 flex flex-col items-center text-black px-5 py-3'>
        <textarea onChange={handlemsg} value={msg}className='w-[80%] h-32 py-2 px-3  outline-none bg-white border rounded-md' placeholder='Enter the email text...'></textarea>
        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed  py-4 mt-5 mb-5"/>
        </div>
         <p className='font-bold text-l'>Total Email in the Files:{emailList.length}</p>
          <button  onClick={Send} className=' bg-blue-950 text-white font-bold px-5 py-2 rounded-md mt-5 mb-5'>{status?"sending...":"Send"}</button>
      </div>
    </div>
  )
}

export default App
