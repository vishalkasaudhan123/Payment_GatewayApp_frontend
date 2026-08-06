
import { Routes, Route, Navigate } from "react-router-dom";
import Payment from "./Payment";

function App() {

    return (

        <Routes>

            {/* Redirect localhost:3001 to localhost:3001/payment */}

            <Route
                path="/"
                element={<Navigate to="/payment" replace />}
            />

            {/* Payment Page */}

            <Route
                path="/payment"
                element={<Payment />}
            />

            {/* Payment Gateway */}

            <Route
                path="/payment/:gateway"
                element={<Payment />}
            />

             {/* Catch-all: redirect unknown routes back to payment */}
            <Route
                path="*"
                element={<Navigate to="/payment" replace />}
            />

        </Routes>

    );

}

export default App;