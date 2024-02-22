import React, { useRef, useEffect, useState, useContext } from "react";
import "../styles/tour-details.css";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import Newsletter from "../shared/Newsletter";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../shared/Booking";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const TourDetails = () => {
	// lấy giá trị id từ URL;
	const { id } = useParams();

	//// Khởi tạo reviewMsgRef với giá trị là chuỗi rỗng
	const reviewMsgRef = useRef("");
	const [tourRating, setTourRating] = useState(null);

	const { user } = useContext(AuthContext);

	const {
		data: tour,
		loading,
		error,
	} = useAxios(`https://server-travel-booking.onrender.com/tours/${id}`);

	console.log(tour);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [tour]);

	const {
		photo,
		title,
		desc,
		price,
		address,
		reviews,
		city,
		distance,
		maxGroupSize,
	} = tour;

	const totalRating = reviews?.reduce((acc, item) => acc + item.rating, 0);
	let avgRating;
	if (totalRating === 0) {
		avgRating = "";
	} else {
		if (totalRating === 1) {
			avgRating = totalRating;
		} else {
			avgRating = totalRating / reviews?.length?.toFixed(1);
		}
	}

	// format date
	const options = { day: "numeric", month: "long", year: "numeric" };

	// submit
	const submitHandler = async (event) => {
		event.preventDefault(); // sự kiện ngăn trình duyệt tải lại trang

		// gán reviewText = giá trị input được nhập vào
		const reviewText = reviewMsgRef.current.value;

		try {
			if (!user) {
				alert("vui long dang nhap");
			}

			const reviewObject = {
				name: user?.userName,
				reviewText,
				rating: tourRating,
			};
			const res = await axios.post(
				`https://server-travel-booking.onrender.com/review/${id}`,
				reviewObject
			);

			if (!res.ok) {
				alert(error.response.data.message);
			}
			console.log(res.data);
		} catch (error) {
			console.error(error);
		}
		// alert(`${reviewText} ${tourRating}`);
	};

	return (
		<>
			<section>
				<Container>
					<Row>
						<Col lg={8}>
							<div className="tour__content">
								<img src={photo} alt="" />

								<div className="tour__info">
									<h2>{title}</h2>

									<div className="d-flex align-items-center gap-5">
										<span className="tour__rating d-flex items-center gap-1">
											<i class="ri-star-fill"></i>
											{avgRating === 0 ? null : avgRating}
											{totalRating === 0 ? (
												"Not rated"
											) : (
												<span>({reviews?.length})</span>
											)}
										</span>

										<span className="tour__address">
											<i className="ri-map-pin-user-fill"></i> Somewhere
										</span>
									</div>

									<div className="tour__extra--details">
										<span>
											<i className="ri-map-pin-2-line"></i> {city}
										</span>
										<span>
											<i className="ri-money-dollar-circle-line"></i> ${price}{" "}
											per/ person
										</span>
										<span>
											<i className="ri-map-pin-time-line"></i> {distance} km
										</span>
										<span>
											<i className="ri-group-line"></i> {maxGroupSize} people
										</span>
									</div>
									<div className="tour__desc">
										<h5>Description</h5>
										<p>{desc}</p>
									</div>
								</div>

								{/*+++=============== Review ================*/}

								<div className="tour__reviews mt-4">
									<h4>Reviews ({reviews?.length} reviews)</h4>

									<Form onSubmit={submitHandler}>
										<div className="rating__group d-flex align-items-center gap-3 mb-4">
											<span onClick={() => setTourRating(1)}>
												1 <i className="ri-star-s-fill"></i>
											</span>

											<span onClick={() => setTourRating(2)}>
												2 <i className="ri-star-s-fill"></i>
											</span>
											<span onClick={() => setTourRating(3)}>
												3 <i className="ri-star-s-fill"></i>
											</span>
											<span onClick={() => setTourRating(4)}>
												4 <i className="ri-star-s-fill"></i>
											</span>
											<span onClick={() => setTourRating(5)}>
												5 <i className="ri-star-s-fill"></i>
											</span>
										</div>

										<div className="review__input">
											<input
												type="text"
												ref={reviewMsgRef}
												placeholder="share your thoughts"
												required
											/>
											<button
												className="btn primary__btn text-white"
												type="submit"
											>
												Submit
											</button>
										</div>
									</Form>

									<ListGroup className="user__reviews">
										{reviews?.map((review) => (
											<div className="review__item">
												<img src={avatar} alt="" />

												<div className="w-100">
													<div className="d-flex align-items-center justify-content-between">
														<div>
															<h5>{review.name}</h5>
															<p>
																{new Date("01-18-2023").toLocaleDateString(
																	"en-US",
																	options
																)}
															</p>
														</div>

														<span className="d-flex align-items-center ">
															{review.rating} <i className="ri-star-s-fill"></i>
														</span>
													</div>

													<h7>{review.reviewText}</h7>
												</div>
											</div>
										))}
									</ListGroup>
								</div>
							</div>
						</Col>

						<Col lg={4}>
							<Booking tour={tour} avgRating={avgRating} />
						</Col>
					</Row>
				</Container>
			</section>
			<Newsletter />
		</>
	);
};

export default TourDetails;
