import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import { useContext, useEffect } from "react";

const LayoutAuth = () => {
  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      if (!isAuthenticated || !user) return;
  
      const res = await getAccessTokenWithPopup({
        authorizationParams: {
          audience: "https://dev-ee4hguujf503yj1e.us.auth0.com/api/v2/",
          scope: "openid profile email",
        },
      });
  
      localStorage.setItem("access_token", res);
      setUserDetails((prev) => ({ ...prev, token: res, email: user?.email }));
  
      mutate(res);
    };
  
    getTokenAndRegister();
  }, [isAuthenticated, user]);  
  return (
    <>
      <Outlet />
    </>
  );
};

export default LayoutAuth;