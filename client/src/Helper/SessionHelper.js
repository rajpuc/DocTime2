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

    setBusinessDetails(BusinessDetails) {
        localStorage.setItem("BusinessDetails", JSON.stringify(BusinessDetails));
    }

    setPermissionDetails(PermissionDetails) {
        localStorage.setItem("PermissionDetails", JSON.stringify(PermissionDetails));
    }

    getBusinessDetails(){
        return JSON.parse(localStorage.getItem("BusinessDetails"));
    }

    getPermissionDetails(){
        return JSON.parse(localStorage.getItem("PermissionDetails"));
    }
    setEmail(Email){
        localStorage.setItem("Email", Email);
    }
    getEmail(){
        return localStorage.getItem("Email");
    }
    setMobile(Mobile){
        localStorage.setItem("Mobile", Mobile);
    }
    getMobile(){
        return localStorage.getItem("Mobile");
    }

    setAdmin(admin){
        localStorage.setItem("admin", admin);
    }
    getAdmin(){
        return localStorage.getItem("admin");
    }


    setName(Name){
        localStorage.setItem("Name", Name);
    }
    getName(){
        return localStorage.getItem("Name");
    }

    setOTP(OTP){
        localStorage.setItem("OTP", OTP);
    }
    getOTP(){
        return localStorage.getItem("OTP");
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
