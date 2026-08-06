// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// import {
//     Container,
//     Card,
//     Button,
//     Form,
//     Row,
//     Col,
//     Alert
// } from "react-bootstrap";

// function Payment() {

//     const navigate = useNavigate();
//     const { gateway } = useParams();

//     const [amount, setAmount] = useState("");
//     const [method, setMethod] = useState("");
//     const [upi, setUpi] = useState("");
//     const [card, setCard] = useState("");
//     const [cvv, setCvv] = useState("");
//     const [bank, setBank] = useState("SBI");
//     const [message, setMessage] = useState("");
//     const [transactionId, setTransactionId] = useState("");
//     const [variant, setVariant] = useState("info");
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (gateway) {
//             setMethod(gateway);
//         }
//     }, [gateway]);

//     const changeGateway = (e) => {
//         const value = e.target.value;
//         setMethod(value);
//         navigate("/payment/" + value);
//     };

//     const pay = async () => {

//         if (!amount || Number(amount) <= 0 || !method) {
//             setVariant("warning");
//             setMessage("Please enter a valid amount and select a payment method");
//             setTransactionId("");
//             return;
//         }

//         setLoading(true);

//         const payload = {
//             amount: Number(amount),
//             method: method,
//             upi: method === "upi" ? upi : null,
//             card: (method === "credit" || method === "debit") ? card : null,
//             cvv: (method === "credit" || method === "debit") ? cvv : null,
//             bank: method === "netbanking" ? bank : null
//         };

//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/pay",
//                 payload,
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             // Backend now returns { success, transactionId, message }
//             const { message: responseMessage, transactionId: txnId } = response.data;

//             setVariant("success");
//             setMessage(responseMessage);
//             setTransactionId(txnId || "");

//         } catch (error) {
//             console.log(error);
//             setVariant("danger");

//             let errorMessage = "Backend server is not running";
//             let errorTxnId = "";

//             if (error.response) {
//                 const data = error.response.data;

//                 if (typeof data === "string") {
//                     // Fallback in case the backend ever sends a plain string
//                     errorMessage = data;
//                 } else if (data) {
//                     // Handles both our PaymentResult shape ({message, transactionId})
//                     // and Spring's default error shape ({message, error})
//                     errorMessage = data.message || data.error || "Something went wrong";
//                     errorTxnId = data.transactionId || "";
//                 }
//             }

//             setMessage(errorMessage);
//             setTransactionId(errorTxnId);

//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Container className="mt-5">
//             <Row className="justify-content-center">
//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Header className="bg-primary text-white text-center">
//                             <h3>Payment Gateway</h3>
//                         </Card.Header>

//                         <Card.Body>
//                             <Form>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Enter Amount</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         placeholder="Enter amount"
//                                         value={amount}
//                                         onChange={(e) => setAmount(e.target.value)}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Select Payment Gateway</Form.Label>
//                                     <Form.Select value={method} onChange={changeGateway}>
//                                         <option value="">Choose Payment</option>
//                                         <option value="upi">UPI</option>
//                                         <option value="credit">Credit Card</option>
//                                         <option value="debit">Debit Card</option>
//                                         <option value="netbanking">Net Banking</option>
//                                     </Form.Select>
//                                 </Form.Group>

//                                 {method === "upi" &&
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>UPI ID</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="example@upi"
//                                             value={upi}
//                                             onChange={(e) => setUpi(e.target.value)}
//                                         />
//                                     </Form.Group>
//                                 }

//                                 {(method === "credit" || method === "debit") &&
//                                     <>
//                                         <Form.Group className="mb-3">
//                                             <Form.Label>Card Number</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 inputMode="numeric"
//                                                 maxLength={16}
//                                                 placeholder="XXXX XXXX XXXX XXXX"
//                                                 value={card}
//                                                 onChange={(e) => setCard(e.target.value)}
//                                             />
//                                         </Form.Group>

//                                         <Form.Group className="mb-3">
//                                             <Form.Label>CVV</Form.Label>
//                                             <Form.Control
//                                                 type="password"
//                                                 inputMode="numeric"
//                                                 maxLength={3}
//                                                 placeholder="***"
//                                                 value={cvv}
//                                                 onChange={(e) => setCvv(e.target.value)}
//                                             />
//                                         </Form.Group>
//                                     </>
//                                 }

//                                 {method === "netbanking" &&
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Bank Name</Form.Label>
//                                         <Form.Select
//                                             value={bank}
//                                             onChange={(e) => setBank(e.target.value)}
//                                         >
//                                             <option value="SBI">SBI</option>
//                                             <option value="HDFC">HDFC</option>
//                                             <option value="ICICI">ICICI</option>
//                                             <option value="AXIS">AXIS</option>
//                                         </Form.Select>
//                                     </Form.Group>
//                                 }

//                                 <Button
//                                     className="w-100"
//                                     variant="success"
//                                     onClick={pay}
//                                     disabled={loading}
//                                 >
//                                     {loading ? "Processing..." : "Pay Now"}
//                                 </Button>
//                             </Form>

//                             <br />

//                             {message &&
//                                 <Alert variant={variant}>
//                                     <div>{message}</div>
//                                     {transactionId &&
//                                         <div className="mt-2">
//                                             <strong>Transaction ID:</strong> {transactionId}
//                                         </div>
//                                     }
//                                 </Alert>
//                             }
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default Payment;




import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    Container,
    Card,
    Button,
    Form,
    Row,
    Col,
    Alert
} from "react-bootstrap";

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

    const changeGateway = (e) => {
        const value = e.target.value;
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
                "http://localhost:8080/pay",
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

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white text-center">
                            <h3>Payment Gateway</h3>
                        </Card.Header>

                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Enter Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select Payment Gateway</Form.Label>
                                    <Form.Select value={method} onChange={changeGateway}>
                                        <option value="">Choose Payment</option>
                                        <option value="upi">UPI</option>
                                        <option value="credit">Credit Card</option>
                                        <option value="debit">Debit Card</option>
                                        <option value="netbanking">Net Banking</option>
                                    </Form.Select>
                                </Form.Group>

                                {method === "upi" &&
                                    <Form.Group className="mb-3">
                                        <Form.Label>UPI ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="example@upi"
                                            value={upi}
                                            onChange={(e) => setUpi(e.target.value)}
                                        />
                                    </Form.Group>
                                }

                                {(method === "credit" || method === "debit") &&
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Card Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={16}
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                value={card}
                                                onChange={(e) => setCard(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={3}
                                                placeholder="***"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                            />
                                        </Form.Group>
                                    </>
                                }

                                {method === "netbanking" &&
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank Name</Form.Label>
                                        <Form.Select
                                            value={bank}
                                            onChange={(e) => setBank(e.target.value)}
                                        >
                                            <option value="SBI">SBI</option>
                                            <option value="HDFC">HDFC</option>
                                            <option value="ICICI">ICICI</option>
                                            <option value="AXIS">AXIS</option>
                                        </Form.Select>
                                    </Form.Group>
                                }

                                <Button
                                    className="w-100"
                                    variant="success"
                                    onClick={pay}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Pay Now"}
                                </Button>
                            </Form>

                            <br />

                            {message &&
                                <Alert variant={variant}>
                                    <div>{message}</div>
                                    {transactionId &&
                                        <div className="mt-2">
                                            <strong>Transaction ID:</strong> {transactionId}
                                        </div>
                                    }
                                </Alert>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Payment;