import React, { useContext, useEffect, useState } from 'react';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput, IonItem, IonLabel,
  IonLoading,
  IonPage, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar, IonCardContent, IonFab, IonCard,IonCardHeader,IonCardTitle
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;

}> { }

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [text, setText] = useState('');
  const [date, setDate] = useState('2021-11-10');
  const [num,setNum] = useState("0");
  const [bool,setBool] = useState("true");
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
      setDate(item.date);
      setNum(item.num);
      setBool(item.bool);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    //const editedItem = item ? { ...item, text } : { text };
    const editedItem = item ? {...item,text,date:date,num:num,bool:bool}:{text,date:date,num:num,bool:bool}
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Item</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.goBack()} >
              Back
            </IonButton>
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader >
            <IonCardTitle>Edit class</IonCardTitle>
          </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel>ID:  </IonLabel>
          <IonInput hidden={item === undefined}  placeholder="id" value={match.params.id} readonly/>
        </IonItem>
      <IonItem>
      <IonLabel>Date</IonLabel>
        <IonContent class='ion-text-right'/>
        <IonSelect  placeholder = "Select date" value={date} onIonChange = {e => setDate(e.detail.value || '')} >
          <IonSelectOption value = "2021-11-10">2021-11-10</IonSelectOption>
          <IonSelectOption value = "2021-12-10">2021-12-10</IonSelectOption>
        </IonSelect>
        {
          savingError && (
              <div>{savingError.message || 'Failed to save class'}</div>
          )
        }
      </IonItem>
        <IonItem>
          <IonLabel>Num</IonLabel>
          <IonContent class='ion-text-right'/>
          <IonInput placeholder="Set num" value={num} onIonChange={e => setNum(e.detail.value || '')} >
          </IonInput>
            {
              savingError && (
                  <div>{savingError.message || 'Failed to save class'}</div>
              )
            }


        </IonItem>
        <IonItem>
          <IonLabel>Bool</IonLabel>
          <IonContent class='ion-text-right'/>
          <IonSelect  placeholder = "Select bool" value={bool} onIonChange = {e => setBool(e.detail.value || '')} >
            <IonSelectOption value = "True">True</IonSelectOption>
            <IonSelectOption value = "False">False</IonSelectOption>
          </IonSelect>
          {
            savingError && (
                <div>{savingError.message || 'Failed to save class'}</div>
            )
          }

        </IonItem>
      </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
