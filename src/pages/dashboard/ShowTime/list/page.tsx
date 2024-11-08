import { Alert, Table } from "antd"
import { useShowTimeQuery } from "../_hooks/useShowTime"
import LoadingComponent from "@/components/ui/LoadingComponent";
import ServerError from "../../_components/500";

const ShowTimeDashBoardPage = () => {
    const { data: showTime, isLoading, isError, columnsShowTime, isPending, errorMutation, isErrorUpdate } = useShowTimeQuery();
    if (isLoading || isPending) return <LoadingComponent />
    if (isError) return <ServerError />
    return (
        <>
            {showTime.data.showtimes.length === 0 || !showTime ? <Alert
                message="Hiện tại chưa có suất chiếu nào!"
                type="warning"
                showIcon
                closable
            /> : (
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary text-uppercase">Danh sách xuất chiếu</h6>
                    </div>
                    {isErrorUpdate && (<Alert type="warning" message={"Bạn không thể xóa rạp!"} description={typeof ((errorMutation as any)?.response?.data?.message) === "string" ? (errorMutation as any)?.response?.data?.message :
                        <>
                            <ul>
                                {
                                    (errorMutation as any)?.response?.data?.message.map((err: any, index: number) => (
                                        <li key={index}>
                                            {err}
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    } />)}
                    <div className="card-body">
                        <Table columns={columnsShowTime} size="small" rowKey={record => record.id} dataSource={showTime.data.showtimes} />
                    </div>
                </div>
            )}

        </>
    )
}

export default ShowTimeDashBoardPage