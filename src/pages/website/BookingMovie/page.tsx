import { SeatPlan } from "@/assets/images/movie";
import { cinema, city, date } from "@/assets/images/ticket";
import { formatDateString } from "@/common/libs/formatDateToString";
import { groupShowtimes } from "@/common/libs/formatObjectFillterMovie";
import { getAllShowTimeByCityAndCinema } from "@/services/bookingClient/bookingClientService";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BookingMovieShowTimePage = () => {
    const { id: idMovie } = useParams();
    const [filterMovie, setFilterMovie] = useState([] as any[]);
    const [isShow, setIsShow] = useState(false);
    const [properties, setProperties] = useState<any>({
        cities: [],
        date: [],
        cinema: [],
        showtimes: [],
    })
    const [filter, setFilter] = useState({
        movie_title: '',
        city: '',
        date: '',
        cinema: '',
    })

    useEffect(() => {
        (async () => {
            const data = await getAllShowTimeByCityAndCinema(+idMovie!);
            setFilter({...filter, movie_title: data.data.movies[0].movie_name})
            setFilterMovie(groupShowtimes(data.data.movies));
        })();
    }, [idMovie]);

    useEffect(() => {
        if (filterMovie.length > 0) {
            const cities = Array.from(new Set(filterMovie.map((item) => item.cinema_city)));
            const city = cities[0] || '';
            const cinemas = getCinemasForCity(filterMovie, city);
            const cinema = cinemas[0] || '';
            const dates = getDatesForCinema(filterMovie, city, cinema);
            const date = dates[0] || '';
            const showtimes = getShowtimesForCinemaAndDate(filterMovie, city, cinema, date);

            setProperties({ cities, date: dates, cinema: cinemas, showtimes });

            setFilter({ ...filter,city, date, cinema });
        }
    }, [filterMovie]);

    const getCinemasForCity = (movies: any[], city: string) => {
        return Array.from(new Set(movies.flatMap((item) => {
            return item.cinema_city === city ? item.cinema : [];
        })));
    };

    const getDatesForCinema = (movies: any[], city: string, cinema: string) => {
        const dates = Array.from(new Set(movies.flatMap((item) => {
            return item.cinema_city === city && item.cinema === cinema ? item.rooms.flatMap((room: any) => room.children.date) : [];
        })));
        return dates.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
    };

    const getShowtimesForCinemaAndDate = (movies: any[], city: string, cinema: string, date: string) => {
        return movies.flatMap((item) => {
            if (item.cinema_city === city && item.cinema === cinema) {
                return item.rooms.flatMap((room: any) => {
                    return room.children.date === date ? {
                        screen: room.screen,
                        showtimes: room.children.showtimes
                    } : [];
                });
            }
            return [];
        });
    };

    const handleChangeFilter = (type: string, value: string) => {
        const updatedFilter = { ...filter, [type]: value };

        let updatedDates = properties.date;
        let updatedCinemas = properties.cinema;
        let updatedShowtimes = properties.showtimes;

        if (type === 'city') {
            updatedCinemas = getCinemasForCity(filterMovie, value);
            const cinema = updatedCinemas[0] || '';
            updatedDates = getDatesForCinema(filterMovie, value, cinema);
            updatedShowtimes = getShowtimesForCinemaAndDate(filterMovie, value, cinema, updatedDates[0] || '');
            updatedFilter.date = updatedDates[0] || '';
            updatedFilter.cinema = cinema;
        } else if (type === 'cinema') {
            updatedDates = getDatesForCinema(filterMovie, filter.city, value);
            updatedShowtimes = getShowtimesForCinemaAndDate(filterMovie, filter.city, value, updatedDates[0] || '');
            updatedFilter.date = updatedDates[0] || '';
        } else if (type === 'date') {
            updatedShowtimes = getShowtimesForCinemaAndDate(filterMovie, filter.city, filter.cinema, value);
        }

        setProperties({
            ...properties,
            date: updatedDates,
            cinema: updatedCinemas,
            showtimes: updatedShowtimes
        });

        setFilter(updatedFilter);
    };
    console.log(properties.showtimes);
    return (
        <>
            {isShow && (
                <section onClick={() => setIsShow(false)} className="window-warning">
                    <div className="lay" />
                    <div className="warning-item">
                        <h6 className="subtitle">Chào mừng!</h6>
                        <h4 className="title">Chọn Ghế của bạn</h4>
                        <div className="thumb">
                            <img src={SeatPlan} alt="movie" />
                        </div>
                        <Link to="#" className="custom-button seatPlanButton">
                            Seat Plans
                            <i className="fas fa-angle-right" />
                        </Link>
                    </div>
                </section>
            )}

            <section className="details-banner hero-area bg_img">
                <div className="container">
                    <div className="details-banner-wrapper">
                        <div className="details-banner-content">
                            <h3 className="title">{filter.movie_title || "Loading..."}</h3>
                            <div className="tags">
                                <a href="#0">English</a>
                                <a href="#0">Hindi</a>
                                <a href="#0">Telegu</a>
                                <a href="#0">Tamil</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="book-section bg-one">
                <div className="container">
                    <div className="ticket-search-form two">
                        <div className="form-group">
                            <div className="thumb">
                                <img src={city} alt="ticket" />
                            </div>
                            <span className="type">Thành phố</span>
                            <div className="nice-select" tabIndex={0}>
                                <span className="current">{filter.city || "Loading..."}</span>
                                <ul className="list">
                                    {properties.cities?.map((c: any, i: number) => (
                                        <li onClick={() => handleChangeFilter('city', c)} key={i} data-value={c} className={i === 0 ? "option selected forcus" : "option forcus"}>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="thumb">
                                <img src={cinema} alt="ticket" />
                            </div>
                            <span className="type">Rạp</span>
                            <div className="nice-select" tabIndex={0}>
                                <span className="current">{filter.cinema || "Loading..."}</span>
                                <ul className="list">
                                    {properties.cinema?.map((c: any, i: number) => (
                                        <li onClick={() => handleChangeFilter('cinema', c)} key={i} data-value={c} className="option">
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="thumb">
                                <img src={date} alt="ticket" />
                            </div>
                            <span className="type">Ngày</span>
                            <div className="nice-select" tabIndex={0}>
                                <span className="current">{formatDateString(filter.date || "")}</span>
                                <ul className="list">
                                    {properties.date?.map((d: any, i: number) => (
                                        <li onClick={() => handleChangeFilter('date', d)} data-value={formatDateString(d)} key={i} className={i === 0 ? "option selected focus" : "option  focus"}>
                                            {formatDateString(d)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div className="ticket-plan-section padding-bottom padding-top">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mb-5 mb-lg-0">
                            <ul className="seat-plan-wrapper bg-five">
                                {properties.showtimes?.map((item: any, index: number) => (
                                    <li className="row" key={index}>
                                        <div className="movie-name col-4">
                                            <span className="name">
                                                {filter.cinema + " - " + item.screen}
                                            </span>
                                        </div>
                                        <div className="movie-schedule col-8">
                                            {item.showtimes.map((s: any, i: number) => (
                                                <div key={i} onClick={() => setIsShow(true)} className="item">{s.time.slice(0, -3)}</div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default BookingMovieShowTimePage