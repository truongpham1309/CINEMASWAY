import { toast } from "react-toastify";

export const validateSeatSelection = (seats: any[], selectedSeatIds: any[]) => {
    for (let row of seats) {
        if (row.length === 0) continue;

        let selectedSeats = row.filter((seat:any) => selectedSeatIds.includes(seat.id));
        if (selectedSeats.length === 0) continue;

        let firstSelectedIndex = row.findIndex((seat:any) => selectedSeatIds.includes(seat.id));
        let lastSelectedIndex = row.length - 1 - row.slice().reverse().findIndex((seat:any) => selectedSeatIds.includes(seat.id));

        // Kiểm tra các ghế trống giữa các ghế đã chọn
        let gap = 0;
        for (let i = firstSelectedIndex; i <= lastSelectedIndex; i++) {
            if (!selectedSeatIds.includes(row[i].id) && row[i].status !== 'Unavailable') {
                gap++;
                if (gap === 1 && (i === lastSelectedIndex || selectedSeatIds.includes(row[i + 1].id))) {
                    toast.error(`Không được để trống ghế ${row[i].seat_number}`,{
                        position: "top-center",
                    });
                    return false;
                }
            } else {
                gap = 0;
            }
        }

        // Kiểm tra ghế trống ở đầu hàng
        if (firstSelectedIndex > 0) {
            let leftGap = firstSelectedIndex;
            let selectedCount = row.slice(firstSelectedIndex).filter((seat:any) => selectedSeatIds.includes(seat.id)).length;
            if (leftGap === 1 && selectedCount === row.length - 1) {
                // Trường hợp đặc biệt: chỉ còn một ghế trống ở đầu hàng
            } else if (leftGap === 1) {
                toast.error(`Không được để trống ghế ${row[firstSelectedIndex - 1].seat_number}`,
                    {
                        position: "top-center",
                    }
                );
                return false; // Ghế không hợp lệ
            }
        }

        // Kiểm tra ghế trống ở cuối hàng
        if (lastSelectedIndex < row.length - 1) {
            let rightGap = row.length - 1 - lastSelectedIndex;
            let selectedCount = row.slice(0, lastSelectedIndex + 1).filter((seat:any) => selectedSeatIds.includes(seat.id)).length;
            if (rightGap === 1 && selectedCount === row.length - 1) {
                // Trường hợp đặc biệt: chỉ còn một ghế trống ở cuối hàng
            } else if (rightGap === 1) {
                toast.error(`Không được để trống ghế ${row[lastSelectedIndex + 1].seat_number}`,{
                    position: "top-center",
                });
                return false; // Ghế không hợp lệ
            }
        }
    }
    return true;
}