import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const currentBooking = JSON.parse(sessionStorage.getItem("bookings")!)?.booking;
const booking: any = currentBooking ? currentBooking : {
    user_id: JSON.parse(localStorage.getItem('user')!).data.id,
    showtime_id: 0,
    seats: [],
    services: [],
    subtotal: 0,
    url: 'http://' + window.location.host + "/movie/booking/status",
}

export const sliceBooking: any = createSlice({
    name: 'booking',
    initialState: booking,
    reducers: {
        add_showtime: (state, action: PayloadAction<any>) => {
            state.showtime_id = action.payload;
        },
        add_user_id: (state, action) => {
            state.user_id = action.payload;
        },
        delete_showtime: (state) => {
            state.showtime_id = 0;
        }
        ,
        add_seats: (state, action: PayloadAction<any>) => {
            const seat = state.seats ? state?.seats?.find((s: any) => s === action.payload.id) : null;
            if (seat) {
                state.seats = state.seats.filter((_s: any) => _s !== action.payload.id);
                state.subtotal = +state.subtotal - Number(action.payload.price);
                return state;
            }

            if (state.seats.length >= 8) {
                toast.error("Bạn chỉ được đặt tối đa 8 ghế trong 1 lần đặt!");
                return state;
            }

            state.seats.push(action.payload.id);
            state.subtotal += Number(action.payload.price);
        },
        add_services: (state, action: PayloadAction<any>) => {
            let { id, price, quantity } = action.payload;
            let subtotal: number = Number(price * quantity);
            let _service = state.services.find((_s: any) => +_s.id === +id);
            if (_service) {
                _service.quantity += Number(quantity);
                _service += subtotal;
                state.subtotal += subtotal;
                return state;
            }
            state.services.push({ service_id: id, quantity: quantity, subtotal: subtotal });
            state.subtotal += subtotal;
            return state;
        },
        increment_service: (state, action: PayloadAction<any>) => {
            const _service = state.services.find((s: any) => s.service_id === action.payload.id);
            if (!_service) {
                return state;
            }

            let _total_quantity = state.services.reduce((total: number, service: any) => {
                return total + parseInt(service.quantity, 10);
            }, 0);

            if (_total_quantity >= state.seats.length * 3) {
                toast.error("Bạn chỉ được đặt tối đa 3 dịch vụ cho mỗi ghế đặt!");
                return state;
            }
            _service.quantity += 1;
            _service.subtotal += action.payload.price;
            state.subtotal += action.payload.price;
            return state;
        },
        decrement_service: (state, action: PayloadAction<any>) => {
            const _service = state.services.find((s: any) => s.service_id === action.payload.id);
            if (!_service) {
                toast.warning("Dịch vụ không tồn tại!", {
                    position: "top-center",
                });
                return state;
            }

            _service.quantity -= 1;
            if (_service.quantity === 0) {
                state.services = state.services.filter((s: any) => s.service_id !== _service.service_id)
            }
            _service.subtotal -= action.payload.price;
            state.subtotal -= action.payload.price;
            return state;
        },
        delete_service: (state, action: PayloadAction<any>) => {
            const _service = state.services.find((s: any) => s.service_id === action.payload.id);
            if (!_service) {
                toast.warning("Dịch vụ không tồn tại!", {
                    position: "top-center",
                });
                return state;
            }
            state.services = state.services.filter((_s: any) => _s.service_id !== _service.service_id);
            state.subtotal -= _service.subtotal;
            return state;
        },
        add_url: (state, action: PayloadAction<any>) => {
            return state.url = action.payload;
        },
        clean_booking: (state) => {
            state.showtime_id = 0;
            state.seats = [];
            state.services = [];
            state.subtotal = 0;
        }
    }
});

export const { add_showtime, add_seats, add_services, clean_booking, delete_showtime, add_user_id, delete_service, decrement_service, increment_service } = sliceBooking.actions;
export default sliceBooking.reducer;