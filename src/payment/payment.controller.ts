import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  @Post('stripe')
  async checkout(@Body('amount') amount: number) {
    const session = this.paymentService.createCheckoutSession(amount);

    return session;
  }
  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    try {
      const sig = req.headers['stripe-signature'] as string;

      let event;

      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
      );

      // Handle different events
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          console.log('✅ Payment completed!', session);
          // TODO: Save payment/order in DB here
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException('somthing went wrong.');
    }
  }
}
