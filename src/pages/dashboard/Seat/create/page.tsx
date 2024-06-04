import { SubmitHandler, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { Button } from 'antd';
import { SeatSchema } from '@/common/validations/seats/seatValid';
import { useSeatMutation } from '../_hooks/useSeat';
import LoadingComponent from '@/components/ui/LoadingComponent';

const SeatCreatePage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(SeatSchema),
        defaultValues: {
            cinema_screen_id: 0,
            seat_type_id: 0,
            status: "",
            seat_number: 0,
        }
    });
    const { isPending, mutate, seatType, cinemaScreen } = useSeatMutation({ type: "CREATE" });
    // console.log(seatType, cinemaScreen);
    const onSubmit: SubmitHandler<any> = (data: any) => {
        console.log(data);
        mutate(data);
    }
    if (cinemaScreen.isLoading || seatType.isLoading) return <LoadingComponent />
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary text-uppercase">Tạo mới màn hình chiếu</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mt-3">
                            <div className="col-sm-12 col-md-6">
                                <div>
                                    <label className="text-gray-800" htmlFor="">Rạp</label>
                                    <select className='form-control' {...register("cinema_screen_id")}>
                                        <option >Chọn rạp</option>
                                        {cinemaScreen.data.data.cinemaScreens.map((cinema: any) => (
                                            <option key={cinema.id} value={cinema.id}>{cinema.name} - {cinema.screen}</option>
                                        ))}
                                    </select>
                                    {errors.cinema_screen_id && (<span className="text-danger">{errors.cinema_screen_id.message}</span>)}
                                </div>
                            </div>

                            <div className="col-sm-12 col-md-6">
                                <div>
                                    <label className="text-gray-800" htmlFor="">Loại ghế</label>
                                    <select {...register("seat_type_id")} className='form-control'>
                                        {seatType.data.seatTypes.map((type: any) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.seat_type_id && (<span className="text-danger">{errors.seat_type_id.message}</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm-12 col-md-6">
                                <div>
                                    <label className="text-gray-800" htmlFor="">Số ghế</label>
                                    <input type="text" {...register("seat_number")} placeholder="Số ghế..." className="form-control" />
                                    {errors.seat_number && (<span className="text-danger">{errors.seat_number.message}</span>)}
                                </div>
                            </div>

                            <div className="col-sm-12 col-md-6">
                                <div>
                                    <label className="text-gray-800" htmlFor="">Trạng thái</label>
                                    <select  className="form-control" {...register("status")} >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="OCCUPIED">OCCUPIED</option>
                                        <option value="UNOCCUPIED">UNOCCUPIED</option>
                                    </select>
                                    {errors.status && (<span className="text-danger">{errors.status.message}</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm-12 col-md-12">
                                <Button loading={isPending} htmlType="submit" type="primary">Thêm mới</Button>
                            </div>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default SeatCreatePage