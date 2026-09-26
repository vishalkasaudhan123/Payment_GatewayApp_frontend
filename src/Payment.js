
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Payment.css";

/* Small inline icon set — no external requests, keeps the bundle self-contained. */
const IconShield = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const IconLock = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4.5" y="10.5" width="15" height="9" rx="2" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
);

const IconBolt = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
);

const IconUpi = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 12h4l3-7 3 14 3-7h3" />
    </svg>
);

const IconCard = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
        <path d="M3 10h18" />
        <path d="M7 14.5h4" />
    </svg>
);

const IconDebit = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
        <path d="M3 10h18" />
        <circle cx="7.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
);

const IconBank = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 10l9-6 9 6" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
        <path d="M3 21h18" />
    </svg>
);

const IconCheck = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </svg>
);

const IconWarning = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3.5 21.5 20h-19L12 3.5z" />
        <path d="M12 10v4.2" />
        <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
);

const IconError = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </svg>
);

const METHODS = [
    { value: "upi", label: "UPI", icon: IconUpi },
    { value: "credit", label: "Credit Card", icon: IconCard },
    { value: "debit", label: "Debit Card", icon: IconDebit },
    { value: "netbanking", label: "Net Banking", icon: IconBank },
];

function Payment() {

    const navigate = useNavigate();
    const { gateway } = useParams();

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [upi, setUpi] = useState("");
    const [card, setCard] = useState("");
    const [cvv, setCvv] = useState("");
    const [bank, setBank] = useState("SBI");
    const [message, setMessage] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [variant, setVariant] = useState("info");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gateway) {
            setMethod(gateway);
        }
    }, [gateway]);

    const changeGateway = (value) => {
        setMethod(value);
        navigate("/payment/" + value);
    };

    const pay = async () => {

        // Only block truly empty input (nothing typed at all), so we don't
        // send NaN to the backend. Everything else — including 0, negative
        // amounts, or no method selected — is sent through so the backend's
        // own validation runs and failed attempts get saved correctly.
        if (amount === "" || amount === null) {
            setVariant("warning");
            setMessage("Please enter an amount");
            setTransactionId("");
            return;
        }

        setLoading(true);

        const payload = {
            amount: Number(amount),
            method: method,
            upi: method === "upi" ? upi : null,
            card: (method === "credit" || method === "debit") ? card : null,
            cvv: (method === "credit" || method === "debit") ? cvv : null,
            bank: method === "netbanking" ? bank : null
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/api/payments",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            const { message: responseMessage, transactionId: txnId } = response.data;

            setVariant("success");
            setMessage(responseMessage);
            setTransactionId(txnId || "");

        } catch (error) {
            console.log(error);
            setVariant("danger");

            let errorMessage = "Backend server is not running";
            let errorTxnId = "";

            if (error.response) {
                const data = error.response.data;

                if (typeof data === "string") {
                    errorMessage = data;
                } else if (data) {
                    errorMessage = data.message || data.error || "Something went wrong";
                    errorTxnId = data.transactionId || "";
                }
            }

            setMessage(errorMessage);
            setTransactionId(errorTxnId);

        } finally {
            setLoading(false);
        }
    };

    const activeMethod = METHODS.find((m) => m.value === method);
    const formattedAmount = amount !== "" && !Number.isNaN(Number(amount))
        ? Number(amount).toLocaleString("en-IN")
        : null;

    const BannerIcon = variant === "success" ? IconCheck : variant === "warning" ? IconWarning : variant === "danger" ? IconError : IconShield;

    return (
        <div className="checkout-shell">
            <div className="checkout">

                {/* Brand / live summary panel */}
                <div className="brand-panel">
                    <div className="brand-mark">
                        <span className="brand-mark-icon">
                            <IconBolt width={17} height={17} color="#0A0F1F" />
                        </span>
                        <div>
                            <div className="brand-mark-name">Payment Gateway</div>
                            <div className="brand-mark-sub">Checkout</div>
                        </div>
                    </div>

                    <div className="amount-showcase">
                        <div className="amount-showcase-label">Amount to pay</div>
                        <div className="amount-showcase-value">
                            <span className="currency">₹</span>
                            {formattedAmount ? (
                                <span>{formattedAmount}</span>
                            ) : (
                                <span className="placeholder">0.00</span>
                            )}
                        </div>
                        <div className="method-preview">
                            {activeMethod ? (
                                <>
                                    <activeMethod.icon />
                                    <span>Paying via {activeMethod.label}</span>
                                </>
                            ) : (
                                <span>Choose a payment method to continue</span>
                            )}
                        </div>
                    </div>

                    <div className="trust-row">
                        <div className="trust-item">
                            <IconLock />
                            <span>256-bit encrypted connection</span>
                        </div>
                        <div className="trust-item">
                            <IconShield />
                            <span>Your card details are never stored</span>
                        </div>
                    </div>
                </div>

                {/* Form panel */}
                <div className="form-panel">
                    <h3 className="form-heading">Complete your payment</h3>
                    <p className="form-subheading">Enter your details below to proceed securely.</p>

                    <div className="field-group">
                        <label className="field-label" htmlFor="amount-input">Amount</label>
                        <div className="amount-field">
                            <span className="prefix">₹</span>
                            <input
                                id="amount-input"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label">Payment method</label>
                        <div className="method-grid">
                            {METHODS.map((m) => {
                                const Icon = m.icon;
                                const isActive = method === m.value;
                                return (
                                    <button
                                        type="button"
                                        key={m.value}
                                        className={"method-card" + (isActive ? " active" : "")}
                                        onClick={() => changeGateway(m.value)}
                                        aria-pressed={isActive}
                                    >
                                        <Icon />
                                        <span>{m.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {method === "upi" &&
                        <div className="field-group detail-fields">
                            <label className="field-label" htmlFor="upi-input">UPI ID</label>
                            <div className="text-field">
                                <IconUpi />
                                <input
                                    id="upi-input"
                                    type="text"
                                    placeholder="example@upi"
                                    value={upi}
                                    onChange={(e) => setUpi(e.target.value)}
                                />
                            </div>
                        </div>
                    }

                    {(method === "credit" || method === "debit") &&
                        <div className="detail-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="card-input">Card number</label>
                                <div className="text-field">
                                    <IconCard />
                                    <input
                                        id="card-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={16}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={card}
                                        onChange={(e) => setCard(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label" htmlFor="cvv-input">CVV</label>
                                <div className="text-field">
                                    <IconLock />
                                    <input
                                        id="cvv-input"
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={3}
                                        placeholder="***"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    }

                    {method === "netbanking" &&
                        <div className="field-group detail-fields">
                            <label className="field-label" htmlFor="bank-select">Bank</label>
                            <div className="text-field">
                                <IconBank />
                                <select
                                    id="bank-select"
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                >
                                    <option value="SBI">State Bank of India</option>
                                    <option value="HDFC">HDFC Bank</option>
                                    <option value="ICICI">ICICI Bank</option>
                                    <option value="AXIS">Axis Bank</option>
                                </select>
                            </div>
                        </div>
                    }

                    <button
                        type="button"
                        className="pay-button"
                        onClick={pay}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" />
                                <span>Processing…</span>
                            </>
                        ) : (
                            <>
                                <IconLock />
                                <span>Pay {formattedAmount ? `₹${formattedAmount}` : "now"}</span>
                            </>
                        )}
                    </button>

                    {message &&
                        <div className={"result-banner " + variant}>
                            <BannerIcon />
                            <div className="text">
                                <div>{message}</div>
                                {transactionId &&
                                    <div className="txn">Transaction ID: {transactionId}</div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Payment;
