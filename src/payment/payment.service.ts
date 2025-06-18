import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
      this.stripe = new Stripe(
        this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      );
  }

  async createCheckoutSession(amount: number, currency = 'usd') {
    try {
      const session = this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Sample Product',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url:
          this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
      });

      return session;
    } catch (e) {
      throw new Error(`somthing went wrong ${e.message}`);
    }
  }
}
