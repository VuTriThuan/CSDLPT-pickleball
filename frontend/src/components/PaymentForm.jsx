function PaymentForm({
  amount,
  setAmount,
  onSubmit,
}) {
  return (
    <div>
      <input
        type="number"
        placeholder="Nhập số tiền"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={onSubmit}>
        Thanh toán
      </button>
    </div>
  );
}

export default PaymentForm;