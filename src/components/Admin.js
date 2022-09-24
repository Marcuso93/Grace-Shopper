import React from "react";
import { useState, useEffect } from "react";
import { fetchAllUsers, patchAdminStatus } from "../utilities/apiCalls";

//pass in user, token
const Admin = ({ user, token }) => {
  const [allUsersData, setAllUsersData] = useState([])

  useEffect(() => {
    (async () => {
      const users = await fetchAllUsers()
      setAllUsersData(users)
    })()
  }, [])

  // TODO: If you are the only admin, you can't remove yourself as admin

  const handleAdminStatusEdit = async (event, userObj) => {
    event.preventDefault();
    const isAdmin = !userObj.isAdmin;
    console.log('isAdmin', isAdmin)
    const userData = await patchAdminStatus(token, { userId: userObj.id, isAdmin });
    console.log('edited user', userData)

    if (userData.message) {
      alert(`${userData.messsage}`)
    } if (userData.id) {
      setAllUsersData([userData, ...removeOldVersionOfUser(allUsersData, userData)]);
    } else {
      alert("There was an error updating the user's admin status");
    }

    // make it update 
  }

  const removeOldVersionOfUser = (previousArray, updatedUser) => {
    return previousArray.filter(user => {
      return user.id != updatedUser.id;
    })
  }
  
  return (
    <>
      <div className="admin-body">
      <h2> Welcome back Admin </h2>

        <h2> Review Users </h2>
        {/* TODO make admin */}
        {
          (allUsersData && allUsersData.length > 0) ?
          allUsersData.map((userData => {
            return (
              <div key={userData.id}>
                <p>{userData.username}</p>
                <p>{userData.address}</p>
                <p>{userData.fullname}</p>
                <p>{userData.email}</p>
                <p>Admin? {userData.isAdmin ? 'Yes' : 'No'}</p>
                <button onClick={(event) => {
                  handleAdminStatusEdit(event, userData)
                }}>Edit Admin Status</button>
              </div>
            )
          })) :
          <div>Nothing to show</div>
        }
      </div>
    </>
  )
}
  
  export default Admin