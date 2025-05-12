
class Transaction {
  constructor({ transactionId, studentId, amountPaid, transactionDate, paymentMethod }) {
      this.transactionId = transactionId;
      this.studentId = studentId;
      this.amountPaid = amountPaid;
      this.transactionDate = transactionDate || new Date();
      this.paymentMethod = paymentMethod; // 'BK_PAY', 'Bank_Transfer', 'MoMo', etc.
  }
}

export default Transaction;