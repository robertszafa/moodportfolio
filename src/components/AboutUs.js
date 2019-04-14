import React, { Component } from 'react'
import { } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'

export default class AboutUs extends Component 
{
    render() 
    {
        return( 
            <div>
                <Jumbotron>
                
                    <div class="page-header">
                        <h1 class="text-center">
                            Meet the team
                        </h1>
                    </div>

                    <h3>
                        Rob
                    </h3>
                    <p>
                        Rob is a big nerd and has completed most of the site
                    </p>

                    <h3>
                        Thep
                    </h3>
                    <p>
                        Thep has just come back from Devon and is helping Phill get to grips with the site
                    </p>

                    <h3>
                        Phill
                    </h3>
                    <p>
                        Phill is enjoying learning react and implementing features
                    </p>

                    <h3>
                        Rahul
                    </h3>
                    <p>
                        Rahul is the AI master of this project
                    </p>

                    <h3>
                        Gareth
                    </h3>
                    <p>
                        Gareth can do everything 
                    </p>

                    <h3>
                        Matt
                    </h3>
                    <p>
                        Matt is off on his jollies
                    </p>

                </Jumbotron>;
            </div>
        )
    } 
}