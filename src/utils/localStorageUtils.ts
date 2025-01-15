// localStorageUtils.js
const LOCAL_STORAGE_KEY = 'formData';

// Helper to generate a unique ID
const generateUniqueId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
// Get all data from local storage
export const getFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
};

// // Save a new item to local storage
// export const saveToLocalStorage = (values :any) => {
//   const existingData = getFromLocalStorage();
//   const updatedData = [...existingData, values];
//   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
//   console.log('Data saved to local storage:', updatedData);
// };

// // Save a new item with a unique ID to local storage
// export const saveToLocalStorage = (values:any) => {
//     const existingData = getFromLocalStorage();
  
//     // Add a unique ID to the data
//     const newData = {
//       ...values,
//       id: generateUniqueId(), // Add unique ID
//     };
  
//     const updatedData = [...existingData, newData];
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
//     console.log('Data saved with unique ID:', updatedData);
//   };

// Save a new item to local storage with a unique sequential ID
export const saveToLocalStorage = (values:any) => {
    const existingData = getFromLocalStorage();
  
    // Generate a unique sequential ID
    const nextId = existingData.length > 0 
      ? Math.max(...existingData.map((item:any) => item.id)) + 1 
      : 1;
  
    const newItem = { ...values, id: nextId }; // Add the ID to the new item
  
    const updatedData = [...existingData, newItem];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  
    console.log('Data saved to local storage:', updatedData);
  };

// Update an item in local storage by ID
//@ts-ignore
export const updateLocalStorageItem = (id, updatedValues) => {
  const existingData = getFromLocalStorage();
//@ts-ignore
  const updatedData = existingData.map((item) =>
    item.id === id ? { ...item, ...updatedValues } : item
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  console.log('Updated data in local storage:', updatedData);
};

// Delete an item from local storage by ID
//@ts-ignore
export const deleteFromLocalStorage = (id) => {
  const existingData = getFromLocalStorage();
//@ts-ignore
  const updatedData = existingData.filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  console.log('Deleted item from local storage:', updatedData);
};
