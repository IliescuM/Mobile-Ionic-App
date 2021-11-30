import React, {useContext} from "react";
import {
    IonButton
} from '@ionic/react';
import {AuthContext} from "../auth";
import {getLogger} from "../core";

const log = getLogger("LogoutButton");

const LogoutButton: React.FC = () => {
    const { logout } = useContext(AuthContext);
    log("render");
    return (
        <IonButton onClick={logout}>LogOut</IonButton>
    );
};

export default LogoutButton;