import React, {useContext} from "react";

import {IonIcon} from "@ionic/react";
import {ellipse} from "ionicons/icons";
import {getLogger} from "../core";
import {AuthContext} from "../auth";

const log = getLogger("NetworkStatusIcon");

const NetworkStatusIcon: React.FC<{slot: string}> = props => {
    const { networkStatus } = useContext(AuthContext);
    const onColor = {color:"lawngreen"}
    const offColor = {color:"red"}

    log("render")
    return (
        <IonIcon slot={props.slot} icon={ellipse} style={
            networkStatus?onColor:offColor}/>
    )
}

export default NetworkStatusIcon;