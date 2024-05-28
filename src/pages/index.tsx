import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedFile, setSelectedFile]= useState(null);

  const fileSelectedHandler = (event:any) => {
    setSelectedFile(event.target.files[0]);
  }
  const handleUpload = async () => {
    const formData = new FormData();
    if(!selectedFile) return console.log("No file selected");
    console.log(selectedFile)
    formData.append("file", selectedFile);
    formData.append("orgId", "tempOrgId");
    formData.append("uploaderId", "tempUserId");
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    console.log(response);
  }
  const handleDelete = async () => {
    const response = await fetch("/api/uploads", {
      method: "DELETE",
      body: JSON.stringify({ orgId: "tempOrgId", docId: "tempdocId" }),
    });
    console.log(response);
  }
  return (
    <div>
      <form onSubmit={(e)=>{
        e.preventDefault();
        handleUpload()}
      }>
        <input name='file1' type='file' accept='*' onChange={(e)=>fileSelectedHandler(e)}/>
      
      </form>
      <button onClick={()=>handleUpload()}>Upload</button>
      <button onClick={()=>handleDelete()}>Delete</button>
    </div>
  );
}
