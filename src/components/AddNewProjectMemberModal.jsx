import { useEffect, useState } from "react";
import { usersService } from "../api/usersService";
import apiClient from "../api/axios";
import { useParams } from "react-router-dom";

 
export default function AddNewProjectMemberModal({ isOpen, onClose, members }) {

    const [users,setUsers] = useState([]);
    const [selectedMembers,setSelectedMembers] = useState([]);

    useEffect(() => {
      async function getUsers(){
        try{
          const res = await usersService.getUsers();
          setUsers(res.data.data);
        }catch(e){
          alert(e);
        }
      }

      getUsers();
   
    },[])

    const {id} = useParams();

    function handleSelect(e){
      // console.log(e.target.selectedOptions);
      const options = Array.from(e.target.selectedOptions,(option => (option.value)));
      setSelectedMembers([options]);
      console.log(selectedMembers[0])
    }

    
    function handleClose(){
        onClose();
    }

    async function handleSubmit(){
      console.log("Your gonna add: ", selectedMembers);
      try{
              const res =   await apiClient.post(`/invite-user/${id}`,{selectedMembers:selectedMembers[0]});
              console.log(res.data);

      }catch(e){
        console.log(e.message);
      }
    }

    const membersIds = new Set(members.map(m=>m.id));
    const selectableUsers = users.filter(user => membersIds.has(user.id) ? null : user);

 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {JSON.stringify(selectedMembers)}
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
 
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Delete Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
 
        <div className="space-y-4">

  
             {selectedMembers &&  <select onChange={(e) =>handleSelect(e)} value={selectedMembers} className="w-full outline-1 outline-blue-500 p-2 pr-3 rounded" multiple={true}>
                  <option>Select users </option>
                  {users.map(user => <option disabled={membersIds.has(user.id)} value={user.id} key={user.id}>{user.id} - {user.name}</option>)  }
              </select>}

        </div>
 
        {/* Actions */}
        <div className="flex gap-3 mt-6">

           <button
            onClick={handleSubmit}
            className="flex-1 border bg-blue-500  border-gray-300 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Add
          </button>
          
          <button
            onClick={handleClose}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}