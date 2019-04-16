import React, { Component } from 'react'
import { } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Carousel from 'react-bootstrap/Carousel'
export default class AboutUs extends Component
{
    render()
    {
        return(
            <div>
              <div class="page-head">
                <h1 class="text-center">
                    Meet the team
                </h1>
              </div>
              <div class="aboutUsCarousel">
                <Carousel>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="..."
                      alt="First slide"
                    />
                  <Carousel.Caption>
                    <h2>Matt Harding</h2>
                    <p>Working hard on styling and other bits</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="..."
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h2>Rahul Khotari</h2>
                    <p>Breaking the server.</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="..."
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h2>Thep</h2>
                    <p>Working on the capture component</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="..."
                    alt="fourth slide"
                  />
                  <Carousel.Caption>
                    <h2>Rob</h2>
                    <p>Putting fires out</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="..."
                    alt="Fifth slide"
                  />
                  <Carousel.Caption>
                    <h3>Gareth</h3>
                    <p>Working quietly on graphs</p>
                  </Carousel.Caption>
                </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="..."
                  alt="Sixth slide"
                />
                <Carousel.Caption>
                  <h2>Phil</h2>
                  <p>All about the React </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            </div>
            </div>
        )
    }
}
