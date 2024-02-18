import React, { useRef } from "react";
import "./search-bar.css";

import { Col, Form, FormGroup } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
	const locationRef = useRef("");
	const distanceRef = useRef(0);
	const maxGroupSizeRef = useRef(0);
	const navigate = useNavigate();

	const searchHandler = async () => {
		const location = locationRef.current.value;
		const distance = distanceRef.current.value;
		const maxGroupSize = maxGroupSizeRef.current.value;

		const apiUrlSearch = `https://server-travel-booking.onrender.com/tours/search/${location}/${distance}/${maxGroupSize}`;

		try {
			const res = await axios.post(apiUrlSearch);

			// Check if the response status is not in the range 200-299
			if (res.status < 200 || res.status >= 300) {
				throw new Error("Server error");
			}

			navigate(
				`/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
				{ state: res.data }
			);
		} catch (error) {
			alert("Error fetching data from the server");
		}
	};

	return (
		<Col lg="12">
			<div className="search__bar">
				<Form className="d-flex items-center gap-4">
					<FormGroup className="d-flex  gap-3 form__group form__group-fast">
						<span>
							<i className="ri-map-pin-line"></i>
						</span>
						<div>
							<h6>Location </h6>
							<input
								type="text"
								placeholder="Where are you going?"
								ref={locationRef}
							/>
						</div>
					</FormGroup>

					<FormGroup className="d-flex gap-3 form__group form__group-fast">
						<span>
							<i className="ri-map-pin-time-line"></i>
						</span>
						<div>
							<h6>Distance</h6>
							<input
								type="number"
								placeholder="Distance k/m"
								ref={distanceRef}
							/>
						</div>
					</FormGroup>

					<FormGroup className="d-flex gap-3 form__group form__group-last">
						<span>
							<i className="ri-group-line"></i>
						</span>
						<div>
							<h6>Max Group Size</h6>
							<input type="number" placeholder="0" ref={maxGroupSizeRef} />
						</div>
					</FormGroup>

					<span className="search__icon" type="submit" onClick={searchHandler}>
						<i className="ri-search-line"></i>
					</span>
				</Form>
			</div>
		</Col>
	);
};

export default SearchBar;
