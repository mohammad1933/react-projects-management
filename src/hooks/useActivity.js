import { useEffect, useState } from "react";
import { activityService } from "../api/activityService";
import { useParams } from "react-router-dom";

export  function useActivity(){

    const {id} = useParams();
    const [activities,setActivities] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        async function getActivities(){
         try{
               const res = await activityService.getActivities(id);
            //    console.log(res.data);
                setActivities(res.data.data);
                setLoading(false);
         }catch(e){
            console.log("Activity Error",e);
            setLoading(false);
         }
        }

        getActivities();
    },[id])


    return {activities,loading};
}

