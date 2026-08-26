import { salesRepository, SalesRepository, AtomicCheckoutPlan } from './sales.repository.js';
import { productsService, ProductsService } from '../products/products.service.js';
import { batchesService, BatchesService } from '../batches/batches.service.js';
import { customersService, CustomersService } from '../customers/customers.service.js';
import { discountsService, DiscountsService } from '../discounts/discounts.service.js';
import { insuranceService, InsuranceService } from '../insurance/insurance.service.js';
import { commissionsService, CommissionsService } from '../commissions/commissions.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CheckoutRequestDTO, SaleQueryDTO, CancelSaleDTO } from './sales.validator.js';
import {
  SaleResponse,
  SaleQueryFilters,
  PaginatedSalesResponse,
} from './sales.types.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { eventBus } from '../../lib/events.js';

function formatSale(raw: any): SaleResponse {
  return {
    id: raw.id,
    invoiceNumber: raw.invoiceNumber,
    customerId: raw.customerId,
    customerName: raw.customer?.name || null,
    customerPhone: raw.customer?.phone || null,
    userId: raw.userId,
    cashierName: raw.user?.name || 'Staff',
    subtotal: Number(raw.subtotal),
    discount: Number(raw.discount),
    discountReason: raw.discountReason,
    insuranceAmount: Number(raw.insuranceAmount),
    tax: Number(raw.tax),
    total: Number(raw.total),
    paidAmount: Number(raw.paidAmount),
    remainingAmount: Number(raw.remainingAmount),
    status: raw.status,
    notes: raw.notes,
    items: (raw.items || []).map((i: any) => ({
      id: i.id,
      productId: i.productId,
      productName: i.product?.name || 'Unknown Product',
      barcode: i.product?.barcode || '',
      batchId: i.batchId,
      batchNumber: i.batch?.batchNumber || null,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      discount: Number(i.discount),
      tax: Number(i.tax),
      total: Number(i.total),
    })),
    payments: (raw.payments || []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount),
      paymentMethod: p.paymentMethod,
      referenceNumber: p.referenceNumber,
      notes: p.notes,
      createdByName: p.createdBy?.name || 'Staff',
      createdAt: p.createdAt,
    })),
    insurance: raw.insurance
      ? {
          id: raw.insurance.id,
          providerName: raw.insurance.insuranceProvider?.name || 'Insurance Provider',
          coveredAmount: Number(raw.insurance.coveredAmount),
          customerAmount: Number(raw.insurance.customerAmount),
          coveragePercentage: Number(raw.insurance.coveragePercentage),
          claimReference: raw.insurance.claimReference,
        }
      : null,
    commissionEarned: raw.commissionTransactions?.[0]
      ? Number(raw.commissionTransactions[0].commissionAmount)
      : undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class SalesService {
  constructor(
    private readonly repo: SalesRepository = salesRepository,
    private readonly products: ProductsService = productsService,
    private readonly batches: BatchesService = batchesService,
    private readonly customers: CustomersService = customersService,
    private readonly discounts: DiscountsService = discountsService,
    private readonly insurance: InsuranceService = insuranceService,
    private readonly commissions: CommissionsService = commissionsService
  ) {}

  async getSales(filters: SaleQueryFilters): Promise<PaginatedSalesResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatSale),
      pagination,
    };
  }

  async getSaleById(id: string): Promise<SaleResponse> {
    const sale = await this.repo.findById(id);
    if (!sale) {
      throw new NotFoundError(`Sale with ID '${id}' not found`);
    }
    return formatSale(sale);
  }

  async getSaleByInvoiceNumber(invoiceNumber: string): Promise<SaleResponse> {
    const sale = await this.repo.findByInvoiceNumber(invoiceNumber.trim());
    if (!sale) {
      throw new NotFoundError(`Sale with invoice number '${invoiceNumber}' not found`);
    }
    return formatSale(sale);
  }

  async checkout(input: CheckoutRequestDTO, cashierId: string): Promise<SaleResponse> {
    let customer: any = null;
    if (input.customerId) {
      customer = await this.customers.getCustomerById(input.customerId);
    }

    // 1. Process items and allocate FEFO batches
    let subtotal = 0;
    const allocatedPlanItems: AtomicCheckoutPlan['items'] = [];

    for (const item of input.items) {
      const product = await this.products.getProductById(item.productId);
      if (!product.isActive) {
        throw new BadRequestError(`Product '${product.name}' is inactive and cannot be sold`);
      }

      // FEFO allocation across active non-expired batches
      const fefoResult = await this.batches.getFEFOBatches(item.productId, item.quantity);
      if (!fefoResult.fulfilled) {
        const availableNonExpired = fefoResult.allocatedBatches.reduce((sum, a) => sum + a.allocatedQuantity, 0);
        throw new BadRequestError(
          `Insufficient eligible stock for product '${product.name}'. Required: ${item.quantity}, Available non-expired: ${availableNonExpired}`
        );
      }

      for (const alloc of fefoResult.allocatedBatches) {
        const unitPrice = Number(product.sellingPrice);
        const itemTotal = Number((alloc.allocatedQuantity * unitPrice).toFixed(2));
        subtotal += itemTotal;

        allocatedPlanItems.push({
          productId: product.id,
          batchId: alloc.batch.id,
          quantity: alloc.allocatedQuantity,
          unitPrice,
          discount: 0,
          tax: 0,
          total: itemTotal,
        });
      }
    }

    subtotal = Number(subtotal.toFixed(2));

    // 2. Calculate Discounts
    let totalDiscount = 0;
    let discountReason = '';

    // 2a. Customer Tier Discount
    if (customer && customer.tier && customer.tier.discountPercentage > 0) {
      const tierDiscountPercent = Number(customer.tier.discountPercentage);
      const tierDiscountAmt = Number(((subtotal * tierDiscountPercent) / 100).toFixed(2));
      totalDiscount += tierDiscountAmt;
      discountReason = `${customer.tier.name} Tier Discount (${tierDiscountPercent}%)`;
    }

    // 2b. Promotional / Code / Custom Discount
    const discountIdentifier = input.discountId || input.discountCode;
    if (discountIdentifier) {
      const promoDiscount = await this.discounts.validateAndCalculateDiscount(
        discountIdentifier,
        subtotal - totalDiscount
      );
      totalDiscount += promoDiscount.discountAmount;
      discountReason = discountReason
        ? `${discountReason} + ${promoDiscount.discountReason}`
        : promoDiscount.discountReason;
    } else if (input.discountAmount && input.discountAmount > 0) {
      const customDiscount = Math.min(input.discountAmount, subtotal - totalDiscount);
      totalDiscount += Number(customDiscount.toFixed(2));
      discountReason = discountReason ? `${discountReason} + Custom Discount` : 'Custom Discount';
    }

    // 2c. Loyalty Points Redemption (10 points = 1 EGP)
    let loyaltyRedeemAmount = 0;
    if (input.redeemPoints && input.redeemPoints > 0) {
      if (!input.customerId) {
        throw new BadRequestError('Customer must be registered to redeem loyalty points');
      }
      loyaltyRedeemAmount = Number((input.redeemPoints / 10).toFixed(2));
      totalDiscount += loyaltyRedeemAmount;
      discountReason = discountReason
        ? `${discountReason} + Redeemed ${input.redeemPoints} pts`
        : `Redeemed ${input.redeemPoints} pts`;
    }

    totalDiscount = Math.min(totalDiscount, subtotal);
    totalDiscount = Number(totalDiscount.toFixed(2));

    const discountedAmount = Number((subtotal - totalDiscount).toFixed(2));

    // 3. Insurance Coverage Calculation
    let insurancePlan: AtomicCheckoutPlan['insurance'] = null;
    let payableByCustomer = discountedAmount;

    if (input.customerInsuranceId) {
      if (!input.customerId) {
        throw new BadRequestError('Customer must be registered to apply insurance');
      }

      const insuranceCalculation = await this.insurance.validateAndCalculateInsurance(
        input.customerInsuranceId,
        input.customerId,
        discountedAmount
      );

      insurancePlan = {
        insuranceProviderId: insuranceCalculation.insuranceProviderId,
        coveredAmount: insuranceCalculation.coveredAmount,
        customerAmount: insuranceCalculation.customerAmount,
        coveragePercentage: insuranceCalculation.coveragePercentage,
        claimReference: insuranceCalculation.claimReference,
      };

      payableByCustomer = insuranceCalculation.customerAmount;
    }

    payableByCustomer = Number(payableByCustomer.toFixed(2));

    // 4. Validate Payments
    const totalPayments = input.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const roundedPayments = Number(totalPayments.toFixed(2));

    if (Math.abs(roundedPayments - payableByCustomer) > 0.01) {
      throw new BadRequestError(
        `Payment total (${roundedPayments} EGP) does not match the payable amount (${payableByCustomer} EGP)`
      );
    }

    // 5. Calculate Loyalty Points Earned (1 point per 10 EGP spent)
    let pointsEarned = 0;
    if (input.customerId && payableByCustomer > 0) {
      pointsEarned = Math.floor(payableByCustomer / 10);
    }

    // 6. Calculate Staff Commission
    let commissionPlan: AtomicCheckoutPlan['commission'] = null;
    const activeRule = await this.commissions.getActiveRule();

    if (activeRule) {
      const rate = Number(activeRule.percentage);
      const commissionAmount = Number(((payableByCustomer * rate) / 100).toFixed(2));
      commissionPlan = {
        ruleId: activeRule.id,
        rate,
        amount: commissionAmount,
      };
    }

    // 7. Assemble Atomic Checkout Plan
    const checkoutPlan: AtomicCheckoutPlan = {
      customerId: input.customerId || null,
      cashierId,
      subtotal,
      discount: totalDiscount,
      discountReason: discountReason || null,
      insuranceAmount: insurancePlan ? insurancePlan.coveredAmount : 0,
      tax: 0,
      total: payableByCustomer,
      paidAmount: roundedPayments,
      remainingAmount: 0,
      notes: input.notes || null,
      items: allocatedPlanItems,
      payments: input.payments,
      insurance: insurancePlan,
      loyalty: input.customerId
        ? {
            redeemPoints: input.redeemPoints || 0,
            pointsEarned,
          }
        : null,
      commission: commissionPlan,
    };

    // 8. Execute Atomic Transaction in Database
    const createdSale = await this.repo.createSaleAtomic(checkoutPlan);
    const saleResponse = formatSale(createdSale);

    // 9. Publish Asynchronous Business Event (decoupled from transaction)
    eventBus.emitSaleCompleted({
      saleId: saleResponse.id,
      invoiceNumber: saleResponse.invoiceNumber,
      customerId: saleResponse.customerId,
      customerName: saleResponse.customerName || null,
      customerPhone: saleResponse.customerPhone || null,
      total: saleResponse.total,
      paidAmount: saleResponse.paidAmount,
      cashierName: saleResponse.cashierName,
      itemsCount: saleResponse.items.length,
    });

    return saleResponse;
  }

  async cancelSale(id: string, actorId: string, input: CancelSaleDTO): Promise<SaleResponse> {
    const cancelled = await this.repo.cancelSaleAtomic(id, actorId, input.reason);
    return formatSale(cancelled);
  }
}

export const salesService = new SalesService();
