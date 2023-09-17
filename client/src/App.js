import { useEffect, useState } from 'react';
import ListItem from './components/ListItem';
import ListHeader from './components/ListHeader';
import Auth from './components/Auth';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  console.log("cookies", cookies)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
    getData();
  }}, []); 

  console.log(tasks);

  // Sort tasks or handle the case where tasks is null or undefined
  const sortedTasks = tasks
    ? [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="app">
      {!authToken && <Auth />}

      {authToken && 
      <>
      <ListHeader listName={' Make your life goals happen 🎯'} getData={getData} />
      <p className="user-email">Welcome back {userEmail} </p>
      {sortedTasks?.map((task) => 
          <ListItem key={task.id} task={task} getData={getData}/>)}
      </>}
      <div><p className="copyright">Creative coding LLC</p></div>
    </div>
  
  );
};

export default App;
