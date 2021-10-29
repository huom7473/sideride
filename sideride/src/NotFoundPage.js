import logo from "./logo.svg";
import React from "react";

export default function NotFoundPage() {
    return (
        <div className="NotFoundPage">
            <header className="NotFoundPage-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    404
                </div>
            </header>
        </div>
    );
}
