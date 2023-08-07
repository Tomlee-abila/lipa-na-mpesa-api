import { HttpException, Injectable } from '@nestjs/common';
import { CreatePushStkDto } from './dto/create-push-stk.dto';
import { UpdatePushStkDto } from './dto/update-push-stk.dto';
import axios from 'axios';

@Injectable()
export class PushStkService {
  async sendStk(createPushStkDto: CreatePushStkDto) {
    // ?auth url
    const authURL = //found in apis Authorization
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    // ?stk push url
    const stkPushURL = //found in apis M-pesa Express (simulate)
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    // ?short code
    const shortCode = 174379;
    // !callback url
    const callbackUrl = 'https://api.nganyaapp.com/api/lipa-na-mpesa/callback';
    // !password
    const basic_token =
      'YlhBVGFVbDlOc1pxbndNQW9RVFpKMDhVc25iYVRJTzY6MEZOUWhvR0FoczA4TDJ0ZA==';

    const passkey =
      'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    // const timestamp = new Date()
    //   .toISOString()
    //   .replace(/[^0-9]/g, '')
    //   .slice(0, -3);

    const date = new Date(Date.now());
    const pad2 = (n: string | number) => (Number(n) < 10 ? '0' + n : n);
    const timestamp =
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds());

    // const password = Buffer.from(shortCode + passkey + timestamp).toString(
    //   'base64',
    // );
    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      'base64',
    );

    console.log(password);
    console.log(timestamp);

    try {
      let accesstoken = null;

      await axios({
        url: authURL,
        method: 'get',
        headers: {
          Authorization: 'Basic ' + basic_token,
        },
      })
        .then((res) => {
          console.log(res.data);
          accesstoken = res.data.access_token;
          console.log(accesstoken);
        })
        .catch((err) => {
          console.log(err);
          throw new HttpException(err.message, err.status);
        });

      console.log('Starting');
      await axios({
        url: stkPushURL,
        method: 'POST',
        headers: {
          Authorization: `Bearer ` + accesstoken,
        },
        data: {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: createPushStkDto.amount,
          PartyA: createPushStkDto.phone,
          PartyB: shortCode,
          PhoneNumber: createPushStkDto.phone,
          CallBackURL: callbackUrl,
          AccountReference: 'CompanyXLTD',
          TransactionDesc: 'Payment of X',
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log('done');
          throw new HttpException(res.data, 200);
        })
        .catch((err) => {
          console.error('error:', err.response.data);
          console.log(err);
          throw new HttpException(err.message, err.status);
        });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  callbackUrl(createPushStkDto: CreatePushStkDto) {
    return 'This action adds a new pushStk';
  }
}
