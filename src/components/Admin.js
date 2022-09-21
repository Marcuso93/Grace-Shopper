import React from "react";
import { useState, useEffect } from "react";
import { fetchAllUsers } from "../utilities/apiCalls";

//pass in user, token
const Admin = ({ user, token }) => {
  const [allUsersData, setAllUsersData] = useState([])

  console.log(allUsersData);

  useEffect(() => {
    (async () => {
      const users = await fetchAllUsers()
      setAllUsersData(users)
    })()
  }, [])
  
    return (
      <>
        <h2> Welcome back Admin </h2>

        <div>
          <h2> Review Users </h2>
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
                  <button>Edit</button>
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