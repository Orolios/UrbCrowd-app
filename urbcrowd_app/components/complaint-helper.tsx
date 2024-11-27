export interface Address {
    addressLine: string | null,
    city: string | null,
    federalState: string | null
  }

export interface Item {
    id: string;
    nome: string;
    descricao?: string,
    endereco: Address;
    tipo: string;
    status: string;
    nota: number;
    imagem?: string | null,
    data: string,
    curtido: boolean
  }

export const getAddressString = (address: Address) => {
    return !!address ? address.addressLine + ' - ' + address.city + ', ' + address.federalState : '';
};

export const translateComplaintType = (complaint: string) => {
    switch (complaint) {
        case ("TRASH"):
            return "Lixo";
          case ("LIGHTING"):
            return "Iluminação";
          case ("SEWAGE"):
            return "Esgoto";
          case ("ASPHALT"):
            return "Asfalto";
          case ("SIDEWALK"):
            return "Calçada";
          case ("WEEDING"):
            return "Capinagem";
          default:
            return "Outro";
    }
}

export const data: any[] = [
    {
      id: "1",
      nome: "Buraco na rua",
      endereco: "Rua A, 123",
      tipo: "asfalto",
      status: "Ativo",
      nota: 32,
    },
    {
      id: "2",
      nome: "Poste quebrado",
      endereco: "Rua B, 456",
      tipo: "TRASH",
      status: "Inativo",
      imagem: "https://urbcrowd-s3.s3.sa-east-1.amazonaws.com/3aa1d1f8-2f60-44f5-ab29-60be917885f3-inception.png",
      nota: 12,
    },
    {
      id: "3",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 44,
    },
    {
      id: "4",
      nome: "Arvore tombadadasdasdasdadasdasdasdasda",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 22,
    },
    {
      id: "5",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 13,
    },
    {
      id: "6",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 20,
    },
    {
      id: "7",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 5,
    },
    {
      id: "8",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 5,
    },
    {
      id: "9",
      nome: "Arvore tombada",
      endereco: "Avenida C, 789",
      tipo: "Natural",
      status: "Ativo",
      nota: 2,
    },
  ];
