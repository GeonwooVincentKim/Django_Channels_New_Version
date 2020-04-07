import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import Hoc from '../hoc/hoc';

class Profile extends React.Component {
    render() {
        if (this.props.token === null) {
           // Redirect component where the URL to="/" and then
           // we just make sure that our token is also passed in
           // const mapStateToProps Method in our props.
           return <Redirect to="/" />;
        }
        return (
            <div className="contact-profile">
            {
                this.props.username !== null ?

                <Hoc>
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>{this.props.username}</p>
                    <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </Hoc>

                :

                null
            }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        // When User Log-out, Don't show Chat Lists.
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(Profile);