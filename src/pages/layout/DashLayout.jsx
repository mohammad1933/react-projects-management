import DashNavbar from "../../components/DashNavbar";
import DashSidebar from "../../components/DashSidebar";

export default function DashLayout({children}) {

   
return <>
    <DashNavbar />
   <div className="flex gap-5 mt-4">
     <DashSidebar />
    {children}
   </div>


</>
}
