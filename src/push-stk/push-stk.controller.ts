import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  // HttpException,
} from '@nestjs/common';
import { PushStkService } from './push-stk.service';
import { CreatePushStkDto } from './dto/create-push-stk.dto';

@Controller('push-stk')
export class PushStkController {
  constructor(private readonly pushStkService: PushStkService) {}

  @Post('send-stk')
  sendStk(@Body() createPushStkDto: CreatePushStkDto) {
    return this.pushStkService.sendStk(createPushStkDto);
  }

  @Post('callbackUrl')
  callbackUrl(@Body() createPushStkDto: CreatePushStkDto) {
    return this.pushStkService.callbackUrl(createPushStkDto);
  }
}
