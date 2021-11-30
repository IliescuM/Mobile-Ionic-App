import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ItemEdit, ItemList } from './class';
import {PrivateRoute} from "./auth";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { ItemProvider } from './class/ItemProvider';
import {getLogger} from "./core";
import {Login, AuthProvider} from "./auth";
const log = getLogger("App");

const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthProvider>
            <Route path="/login" component={Login} exact={true}/>
            <ItemProvider>
              <PrivateRoute path="/items" component={ItemList} exact={true}/>
              <PrivateRoute path="/item" component={ItemEdit} exact={true}/>
              <PrivateRoute path="/item/:id" component={ItemEdit} exact={true}/>
            </ItemProvider>
            <Route exact path="/" render={() =>
            {
              log("redirect to /items, not authenticated");
              return <Redirect to="/items"/>
            }}/>
          </AuthProvider>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
);

export default App;
