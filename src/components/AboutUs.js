import React, { Component } from 'react'
import { } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import background from '../images/testbg.png'
import matt from '../images/Matt.jpg'
import phil from '../images/Phill.jpg'
import rahul from '../images/Rahul.jpg'
import rob from '../images/Rob.jpg'
import thep from '../images/Thep.jpg'
import gareth from '../images/Gareth.jpg'
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
                      className="d-block w-100 carouselImage"
                      src={matt}
                      alt="First slide"
                    />
                  <Carousel.Caption>
                    <h2>Matt Harding</h2>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={rahul}
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h2>Rahul Kothari</h2>

                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={thep}
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h2>Thepnathi Chindalaksanaloet</h2>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={rob}
                    alt="fourth slide"
                  />
                  <Carousel.Caption>
                    <h2>Robert Szafarczyk</h2>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={gareth}
                    alt="Fifth slide"
                  />
                  <Carousel.Caption>
                    <h3>Gareth Liles</h3>
                  </Carousel.Caption>
                </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 carouselImage"
                  src={phil}
                  alt="Sixth slide"
                />
                <Carousel.Caption>
                  <h2>Phill Beattie</h2>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            <div id="about us">
              <p>
                We are team 40 for the 2019 group project cohort. Each of us
                has had some experience with Artificial Intelligence through
                university coursework, and thought we could put our experience
                to good use on an interesting problem!

                Thus we would like to present MoodPorfolio, a website that allows
                users to easily and automatically track, and collect information
                about their emotional states, with simple data representation
                which allows them to make decisions and find out how to live their
                best life.
              </p>
            </div>
            </div>

            </div>
        )
    }
}
