import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom";
import { useMovieQuery } from "../../Movies/_hooks/useMovie";
import { useRoomCinemaQuery } from "../../RoomsCinema/hooks/useRoomsCinema";
import { toast } from "react-toastify";
import { createShowTime, deleteShowTimeByID, getAllShowTimeDashBoard, updateShowTimeByID } from "@/services/showTime/showTimeService";
import { Button, TableProps } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

export const useShowTimeMutation = ({ type }: { type: "CREATE" | "UPDATE" | "DELETE" }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const movie = useMovieQuery();
    const cinema = useRoomCinemaQuery();

    const mutation = useMutation({
        mutationFn: async (show_time: any) => {
            switch (type) {
                case "CREATE":
                    await createShowTime(show_time);
                    break;
                case "UPDATE":
                    await updateShowTimeByID(show_time);
                    break;
                case "DELETE":
                    await deleteShowTimeByID(show_time.id!);
                    break;
                default: toast.warning("Thao tác không hợp lệ!");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['SHOW-TIME']
            });
            switch (type) {
                case "CREATE":
                    navigate('/dashboard/show-time');
                    toast.success("Đã thêm mới xuất chiếu!");
                    break;
                case "UPDATE":
                    navigate('/dashboard/show-time');
                    toast.success("Đã cập nhật xuất chiếu!");
                    break;
                case "DELETE":
                    toast.success("Đã xóa xuất chiếu!");
                    break;
                default: toast.warning("Thao tác không hợp lệ!");
            }
        },
        onError: () => {
            switch (type) {
                case "CREATE":
                    toast.error("Không thể thêm xuất chiếu!");
                    break;
                case "UPDATE":
                    toast.error("Không thể cập nhật xuất chiếu!");
                    break;
                case "DELETE":
                    toast.error("Không thể xóa xuất chiếu!");
                    break;
            }
        }
    })

    return { movie, cinema, ...mutation }
}

export const useShowTimeQuery = () => {
    const query = useQuery({
        queryKey: ['SHOW-TIME'],
        queryFn: async () => {
            const data = await getAllShowTimeDashBoard();
            return data;
        }
    });

    const { mutate, isPending } = useShowTimeMutation({ type: "DELETE" });
    const onDelete = (data: any) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này!")) return;
        mutate(data);
    }

    const columnsShowTime: TableProps<any>["columns"] = [
        {
            title: "#",
            key: "index",
            render: (_, __, index) => index + 1
        },
        {
            title: "Phim",
            key: "movie",
            dataIndex: "movie"
        },
        {
            title: "Rạp",
            key: "cinema_screen",
            align: "center",
            render: (record) => `${record.cinema} - ${record.screen}`,
        },
        {
            title: "Ngày chiếu",
            key: "show_date",
            dataIndex: "show_date"
        },
        {
            title: "Giờ chiếu",
            key: "show_time",
            dataIndex: "show_time"
        },
        {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status"
        },
        {
            title: "Thao tác",
            key: "action",
            render: (record) => <>
                <Link className="mx-2" to={`/dashboard/show-time/edit/${record.id}`} ><Button icon={<EditFilled />} className="btn-success" ></Button></Link>
                <Button onClick={() => onDelete(record)} className="btn-danger" icon={<DeleteFilled />} ></Button>
            </>
        }
    ]

    return { ...query, columnsShowTime, isPending }
}