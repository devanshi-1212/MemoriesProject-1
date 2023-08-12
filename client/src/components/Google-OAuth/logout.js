import {GoogleLogout} from 'react-google-login';

const clientId="1069109333761-6luhijjhgb098cmi0ebcrlffvh1v8p7n.apps.googleusercontent.com";

function Logout() {

    const onSuccess=(res)=>{
        console.log("Logout successful!");
    }

    return(
        <div id="signOutButton">
            <GoogleLogout 
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;