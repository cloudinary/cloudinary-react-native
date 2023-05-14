import fetch from 'node-fetch';
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postName: 'React updates ' })
  };

  const apiRequest = async () => {
    try {
      await fetch(
        'https://reqres.in/api/posts', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              Alert.alert("Post created at : ",
                data.createdAt);
            });
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  export { apiRequest };