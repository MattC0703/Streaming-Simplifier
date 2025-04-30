// Code by Harrison Kane (unfinished)
const newUser = {
  "username": "test",
  "password": "password",
  "watch_later_ids": ["603"]
};

const newUser2 = {
    "username": "test2",
    "password": "password2",
    "watch_later_ids": ["603"]
};

async function getJsonArrayFromJsonBin() {
  const response = await fetch('https://api.jsonbin.io/v3/b/66083e73ad19ca34f85228cb', {
	headers: {
	  'X-MASTER-KEY': '$2a$10$hJOp35WhNpl3QFHlfPzBsOtgMz9fTeJXwOK40w5u8zmuCLxTVFk26',
	},
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  console.log("hello");
  data = await response.json();
  data = data.record;
  return data;
}
async function butthole(){
  console.log("butss");
}

async function addUser(newUser) {
  try {
    // Fetch the existing JSON array from jsonbin.io
    const existingData = await getJsonArrayFromJsonBin();
    if (existingData.some(user => user.username === newUser.username)) {
      console.error('User already exists.');
      return;
    } else {
      // Add the new user to the JSON array
      existingData.push(newUser);

      // Save the updated JSON array to jsonbin.io
      const response = await fetch('https://api.jsonbin.io/v3/b/66083e73ad19ca34f85228cb', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$hJOp35WhNpl3QFHlfPzBsOtgMz9fTeJXwOK40w5u8zmuCLxTVFk26',
        },
        body: JSON.stringify(existingData),
      });

      if (response.ok) {
        console.log('Data saved successfully.'); 
      } else {
        console.error('Failed to save data:', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error adding data:', error);
  }
}

async function addWatchLaterId(username, movie_id) {
    try{
        const data = await getJsonArrayFromJsonBin();
        const user = data.find(user => user.username === username);
        user.watch_later_ids.push(movie_id);
        console.log(user);
        // console.log(data)
        deleteUser(username);
        addUser(user);
        // console.log('Movie added to watch later list.');
    } catch (error) {
        console.error('Error adding movie to watch later list:', error);
    }
}

async function deleteUser(targetUser) {
  try {
    const existingData = await getJsonArrayFromJsonBin();
    const newData = existingData.filter(user => user.username !== targetUser);
    
    const response = await fetch('https://api.jsonbin.io/v3/b/66083e73ad19ca34f85228cb', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$hJOp35WhNpl3QFHlfPzBsOtgMz9fTeJXwOK40w5u8zmuCLxTVFk26',
      },
      body: JSON.stringify(newData),
    });
    if (response.ok) {
      console.log('User deleted successfully.');
    } else {
      console.error('Failed to delete user:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}


//test function
async function test() {
  alert("in function");
    await addUser(newUser);
    alert("NewUser");
    console.log("addUser(newUser) executed");
    await getJsonArrayFromJsonBin().then(data => console.log(data));
    // await addUser(newUser2)
    // console.log("addUser(newUser2) executed")
    // await deleteUser("test")
    // console.log('deleteUser("test") executed')
    // await getJsonArrayFromJsonBin().then(data => console.log(data));
    // await deleteUser("test2")
    console.log('deleteUser("test") executed');
    await getJsonArrayFromJsonBin().then(data => console.log(data));
    await addWatchLaterId("test", "603");

}

//test function call
//test()
// addWatchLaterId("test", "603")

console.log("function file");