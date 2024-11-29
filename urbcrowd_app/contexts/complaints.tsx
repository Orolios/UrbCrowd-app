import React, {createContext, useEffect, useState} from "react";
import { Item } from "@/components/complaint-helper";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';

type ComplaintContextType = {
    initialComplaints: Item[];
    setBearer(value: boolean): any;
    render: number;
    setData(render: number): any;
}
export const ComplaintContext = createContext({} as ComplaintContextType);

const ComplaintProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isBearerSet, setIsBearerSet] = useState<boolean>(false);
    const [inititalData, setInitialData] = useState<Item[] | null>(null);
    const [render, setRender] = useState<number>(0);

    const updateRender = (render: number) => setRender(render);

    useEffect(() => {
        const getBearer = async() => {
          let bearer = await SecureStore.getItemAsync('secure_token')
    
          const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';
          
          fetch(hostUri + '/complaints', {
            method: 'GET',
            headers: {Authorization: 'Bearer ' + bearer}
        }).then(response => response.json())
        .then((data) => {
          const complaintList: Item[] = data.map((complaint: any) => {
            return {  id: complaint.id,
              nome: complaint.title,
              descricao: complaint.description,
              endereco: complaint.address,
              geolocation: complaint.geolocation,
              tipo: complaint.type,
              status: complaint.status,
              nota: complaint.thumbsUpCount,
              imagem: complaint.imageHref,
              data: complaint.createdDate,
              curtido:  complaint.userHasThumbsUp }
          })
          
          return complaintList;
        })
        .then(list => setInitialData(list))
        .catch(error => {Alert.alert("Erro", "Não foi possível obter os problemas relatados no momento.")})
          };
        
          if (isBearerSet) {
            getBearer();
          }
      }, [render, isBearerSet])

    return(
        <ComplaintContext.Provider value={{ initialComplaints: inititalData!, setBearer: setIsBearerSet, render: render, setData: updateRender }}>
            {children}
        </ComplaintContext.Provider>

    )
}

export default ComplaintProvider;