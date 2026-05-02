export interface User {
  UserID: number;
  Username: string;
  RoleId: number;
  CreatedDate: string;
}

export interface Role {
  RoleID: number;
  Name: string;
}

export interface Table {
  TableID: number;
  TableNumber: string;
  Capacity: number;
  IsReserved: boolean;
}

export interface Reservation {
  ReservationID: number;
  TableID: number;
  UserID: number;
  UserUsername: string;
  TableNumber: string;
  ReservationDateTime: string;
  NumberOfPeople: number;
}

export interface MenuItem {
  MenuItemID: number;
  Name: string;
  Description: string;
  Price: number;
  IsActive: boolean;
  Image: string | null;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  MenuItemID: number;
  MenuItemName: string;
  Quantity: number;
  Price: number;
}

export interface Order {
  OrderID: number;
  UserID: number;
  UserUsername: string;
  TableID: number;
  TableNumber: string;
  OrderDateTime: string;
  Status: string;
  items?: OrderItem[];
}

export interface OrderCreateRequest {
  tableId: number;
  items: { menuItemId: number; quantity: number }[];
}

export interface Transaction {
  TransactionID: number;
  OrderID: number;
  Amount: number;
  TransactionDateTime: string;
  UserID: number;
  UserUsername: string;
}

export interface Review {
  ReviewID: number;
  OrderID: number;
  Rating: number;
  Comment: string;
  CreatedAt: string;
  UserID: number;
  UserUsername: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  userId: number;
}
