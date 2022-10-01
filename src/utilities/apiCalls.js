// const apiUrl = 'localhost:4000/api'

export const apiCall = async (url, method = 'GET', token, body) => {
  let data = false;
  try {
    const response = await fetch('http://localhost:4000/api' + url, setToken(getFetchOptions(method, body), token));
    data = await response.json();

    if (data.error) {
      throw data.error;
    }
  } catch (error) {
    console.error(error);
  }
  return data;
}

const getFetchOptions = (method, body) => {
  return {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

const setToken = (body, token) => {
  const localToken = JSON.parse(localStorage.getItem('grace-shopper-jwt'));
  if (localToken) {
    body.headers = Object.assign(body.headers, { 'Authorization': `Bearer ${localToken}` })
    return body;
  } else if (token) { 
    body.headers = Object.assign(body.headers, { 'Authorization': `Bearer ${token}` }) 
  }
  return body;
}

export const fetchAllUsers = async () => {
  const data = await apiCall('/users');
  return data || []
}

export const loginUser = async (username, password) => {
  const data = await apiCall('/users/login', 'POST', null, { username, password });
  return data || []
}

export const registerUser = async (username, password, address, fullname, email) => {
  const data = await apiCall('/users/register', 'POST', null, {
    username,
    password,
    address,
    fullname,
    email
  });
  return data || []
}

export const getLocalUser = async () => {
  const data = await apiCall('/users/me');
  return data || []
}

export const patchAdminStatus = async(token, {userId, isAdmin}) => {
  const data = await apiCall(`/users/${userId}`, 'PATCH', token, {isAdmin});
  return data || []
}

export const fetchCart = async ({userId, token}) => {
  const data = await apiCall(`/cart_inventory/user/${userId}`, 'GET', token);
  return data || []
}

export const fetchInventory = async () => {
    const data = await apiCall('/inventory');
    return data || []
}

export const fetchInventoryForAdmin = async () => {
  const data = await apiCall('/inventory/admin');
  return data || []
}

export const postInventory = async ( token, {name, image, description, price, purchasedCount, stock, isActive, isCustomizable}) => {
  const data = await apiCall('/inventory', 'POST', token, {
    name, 
    image, 
    description, 
    price, 
    purchasedCount, 
    stock, 
    isActive, 
    isCustomizable
  })
  return data || []
}

export const deactivateInventory = async (inventoryId, token) => {
  const data = await apiCall(`/inventory/${inventoryId}`, 'DELETE', token)
  return data || []
}

export const patchInventory = async ( inventoryId, fields, token ) => {
  const data = await apiCall(`/inventory/${inventoryId}`, 'PATCH', token, fields)
  return data || []
}

export const fetchInventoryById = async (itemId) =>{
  const data = await apiCall(`/inventory/${itemId}`);
  return data || []
}

export const fetchReviewsByItemId = async (itemId) => {
    const data = await apiCall(`/reviews/item/${itemId}`);
    return data || []
}

export const postReview = async (token, { userId, username, itemId, stars, description }) => {
    const data = await apiCall('/reviews', 'POST', token, {
      userId,
      username,
      itemId,
      stars,
      description
    })
    return data || []
}

export const postNewItemToCart = async (token, {userId, inventoryId, quantity, price}) => {
  const data = await apiCall('/cart_inventory', 'POST', token, {
    userId, 
    inventoryId, 
    quantity, 
    price
  })
  return data || []
}

export const removeItemFromCart = async (token, cartInventoryId) => {
  const data = await apiCall (`/cart_inventory/${cartInventoryId}`, "DELETE", token)
  return data || []
}

export const patchItemInCart = async (token, cartInventoryId, fields) => {
  const data = await apiCall(`/cart_inventory/${cartInventoryId}`, "PATCH", token, fields)
  return data || []
}

export const postNewOrder = async (token, {userId, price, orderDate}) => {
  const data = await apiCall(`/orders`, "POST", token, {
    userId,
    price, 
    orderDate
  })
  return data || []
}

export const fetchUserOrders = async (token, userId) => {
  const data = await apiCall(`/orders/user/${userId}`, "GET", token)
  return data || []
}

export const fetchAllOrders = async () => {
  const data = await apiCall(`/orders`)
  return data || []
}