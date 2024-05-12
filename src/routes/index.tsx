import SignUpUserPage from "@/pages/auth/SignUp/page"
import LayoutDashBoard from "@/pages/dashboard/LayoutDashBoard"
import { BrowserRouter, Route, Routes } from "react-router-dom"

const Router = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="admin" element={<LayoutDashBoard />}>

                </Route>

                <Route path="/signup" element={<SignUpUserPage />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Router