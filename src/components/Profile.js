import React, { Component } from 'react'
import { } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'

export default class Profile extends Component 
{
    render() 
    {
        return( 
            <div>
                <Jumbotron>
                
                    <div class="page-header">
                        <h1 class="text-center">
                            Personal Profile
                        </h1>
                    </div>

                    <h3>
                        USER
                    </h3>
                    <p>
                        some sort of user details or something
                    </p>

                </Jumbotron>;
            </div>
        )
    } 
}