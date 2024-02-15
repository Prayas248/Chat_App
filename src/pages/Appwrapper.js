import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import "./appwrapper.css";

import Cookies from "universal-cookie";

const cookies = new Cookies();

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1> ChatterBox</h1>
      </div>
      
      <div className="app-container">{children}</div>
      <div className="button-bahr">
      {isAuth && (
        <div>
          <button onClick={signUserOut} className="sign-out"> Sign Out</button>
        </div>
      )}{isAuth &&(
       <button  onClick={()=>{setIsInChat(false)}} className="sign-out"> Room Select</button>
      )}
       </div>

    </div>
  );
};