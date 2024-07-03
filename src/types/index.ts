interface IProduct{
  id: string; 
  title: string; 
  image: string; 
  price: number | null; 
  description: string;  
}

interface IModal {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void; 
}

interface IPage {
  catalog: HTMLElement[];
}

interface IBasket {
  total: number;
  items: HTMLElement[];
}

interface IForm {
  valid: boolean;
  errors: string[];
}

interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}