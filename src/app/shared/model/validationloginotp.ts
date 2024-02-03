import { Header } from '../services/header';

export class LoginValidatonOtpModel {
  otp: string;
  phoneNumber: string;
  header: Header;
  systemId: string;
  companyId: string;

  constructor() { }
}
