import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home           from "./pages/home";
import AppAbout       from "./pages/about";
import AppServices    from "./pages/sreves";
import AppWorks       from "./pages/Works";
import AppPricing     from "./pages/pric";
import AppContact     from "./pages/contact";
import AppHeader      from "./pages/header_home";
import AppFooter      from "./pages/footer_home";
import SignUp         from "./pages/signup.component";
import LoginUser      from "./pages/login.component";
import PurchasePage   from "./pages/cardProduact";

// Admin
import HeaderAdmin        from "./admin/headerAdmin";
import LoginAdmin         from "./admin/loginAdmin";
import AuthAdminComp      from "./admin/authAdminComp";
import UsersAdminList     from "./admin/users/usersAdminList";
import CompaniesAdminList from "./admin/companies/companiesAdminList";
import EditCompaniForm    from "./admin/companies/editCompaniesFrom";
import AddCompaniForm     from "./admin/companies/addCompaniesForm";
import DevicesAdminList   from "./admin/devices/devicesAdminList";
import AddDeviceForm      from "./admin/devices/addDeviceForm";
import EditDeviceForm     from "./admin/devices/editDeviceForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Global sticky header shown on all public pages */}
      <AppHeader />

      <Routes>
        {/* ── Public pages ── */}
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<AppAbout />} />
        <Route path="/services" element={<AppServices />} />
        <Route path="/works"    element={<AppWorks />} />
        <Route path="/pricing"  element={<AppPricing />} />
        <Route path="/contact"  element={<AppContact />} />

        {/* ── Auth ── */}
        <Route path="/sign-in" element={<LoginUser />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* ── Shopping ── */}
        <Route path="/PurchasePage/:id" element={<PurchasePage />} />

        {/* ── Admin panel ──
            BUG FIXED: The original file had the literal text "npm run build"
            sitting between <Route> elements inside JSX. JSX only allows
            expressions inside {}, not raw text — this caused a React parse
            error that prevented the app from compiling.
        */}
        <Route path="/admin/login"               element={<LoginAdmin />} />
        <Route path="/admin/users"               element={<UsersAdminList />} />
        <Route path="/admin/companies"           element={<CompaniesAdminList />} />
        <Route path="/admin/companies/edit/:id"  element={<EditCompaniForm />} />
        <Route path="/admin/companies/add"       element={<AddCompaniForm />} />
        <Route path="/admin/devices"             element={<DevicesAdminList />} />
        <Route path="/admin/devices/add"         element={<AddDeviceForm />} />
        <Route path="/admin/devices/edit/:id"    element={<EditDeviceForm />} />
        <Route path="/admin/"                    element={<HeaderAdmin />} />
        <Route path="/admin/:dir/*"              element={<AuthAdminComp />} />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<h2 style={{ textAlign: "center", padding: "4rem" }}>404 — Page not found</h2>} />
      </Routes>

      <ToastContainer position="top-center" />

      {/* Global fixed footer shown on all pages */}
      <footer id="footer">
        <AppFooter />
      </footer>
    </BrowserRouter>
  );
}
