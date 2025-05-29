class SessionHelper {
    setToken(token){
        localStorage.setItem("token", token);
    }
    getToken(){
        return localStorage.getItem("token");
    }

    setUserDetails(UserDetails) {
        localStorage.setItem("UserDetails", JSON.stringify(UserDetails));
    }
    getUserDetails(){
        return JSON.parse(localStorage.getItem("UserDetails"));
    }

    setMobile(Mobile){
        localStorage.setItem("Mobile", Mobile);
    }
    getMobile(){
        return localStorage.getItem("Mobile");
    }


    setName(Name){
        localStorage.setItem("Name", Name);
    }
    getName(){
        return localStorage.getItem("Name");
    }

    removeSessions = () => {
        localStorage.clear();
        window.location.href = "/login";
    }
}


export const {
    setEmail,
    getEmail,
    setOTP,
    getOTP,
    setMobile,
    getMobile,
    setAdmin,
    getAdmin,
    setName,
    getName,
    setToken,
    getToken,
    setUserDetails,
    getUserDetails,
    setBusinessDetails,
    getBusinessDetails,
    setPermissionDetails,
    getPermissionDetails,
    removeSessions
} = new SessionHelper();
