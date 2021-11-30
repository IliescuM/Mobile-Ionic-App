import React from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;

}

const Item: React.FC<ItemPropsExt> = ({ id,
                                          text, date,
                                          num,bool,
                                          onEdit
}) => {
  return (
      <IonCard onClick={() => onEdit(id)}>

          <IonCardHeader>
              <IonCardTitle>{text}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
              <IonItem>
                  <IonLabel>Date: {date}</IonLabel>
              </IonItem>
              <IonItem>
              <IonLabel>Num: {num}</IonLabel>
              </IonItem>
              <IonItem>
                  <IonLabel>Bool: {bool}</IonLabel>
              </IonItem>
              </IonCardContent>
          </IonCard>
  );
};

export default Item;
