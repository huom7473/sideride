import logo from "./logo.svg";
import React from "react";

export default function SearchPage() {
    return (
        <div className="SearchPage">
            <header className="SearchPage-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    Search Page
                </div>
            </header>
        </div>
    );
}
