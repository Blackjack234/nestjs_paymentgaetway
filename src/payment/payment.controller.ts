import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe')
  async checkout(@Body('amount') amount: number) {
    const session = this.paymentService.createCheckoutSession(amount);

    return session;
  }
}
