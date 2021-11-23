import logo from "./logo.svg";
import React from "react";
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import styled from 'styled-components';
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";

Amplify.configure(awsconfig);




const Header = () => {
    const history = useHistory();

    const redirectSearch = () => {
        history.push('/');
    }

    const redirectCreateRide = () => {
        history.push('/createride');
    }

    const signOut = () => {
        try {
            Auth.signOut().then((res) => { history.push('/'); window.location.reload(false) });
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <SideBarContainer>
                <Button onClick={redirectCreateRide}>Host Ride</Button>
                <Button onClick={redirectSearch}>Search Rides</Button>
                <Button>My Rides</Button>
                <Button onClick={signOut}>Sign Out</Button>
            </SideBarContainer>
        </header>
    )
}

const SideBarContainer = styled.div`
    width:500px;
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    text-align:center;
`;

export default Header;