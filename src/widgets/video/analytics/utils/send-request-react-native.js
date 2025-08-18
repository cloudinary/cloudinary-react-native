export const sendRequest = async (url, data) => {
  
  try {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    return null;
  }
}; 