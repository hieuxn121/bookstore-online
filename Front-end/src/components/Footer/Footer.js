import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import logo from "../../assets/circles.png";

const Footer = () => {
  return (
    <MDBFooter color="unique-color-dark" className="font-small pt-4 mt-4">
      <MDBContainer className="text-center text-md-left">
        <MDBRow className="text-center text-md-left mt-3 pb-3">
          <MDBCol md="3" lg="3" xl="4" className="mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">
              <img src={logo} alt="Book Store App" height="50px" />
              <strong>Nta-bookstore</strong>
            </h6>
            <p>
              Nta-bookstore là một ứng dụng web React trực tuyến nơi khách hàng
              có thể mua sách trực tuyến. Thông qua cửa hàng sách này, người
              dùng có thể tìm kiếm một cuốn sách theo tiêu đề của nó và sau đó
              có thể thêm vào mua sắm giỏ hàng và cuối cùng mua hàng.
            </p>
          </MDBCol>
          <hr className="w-100 clearfix d-md-none" />
          <MDBCol md="4" lg="3" xl="3" className="mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">
              <strong>Liên hệ</strong>
            </h6>
            <p>
              <i className="fa fa-envelope mr-3" /> tuananh.nguyen@gmail.com
            </p>
            <p>
              <i className="fa fa-phone mr-3" /> 0911442897
            </p>
          </MDBCol>
        </MDBRow>
        <hr />
        <MDBRow className="d-flex align-items-center">
          <MDBCol md="8" lg="8">
            <p className="text-center text-md-left grey-text">
              &copy; 2023 Tạo bởi
              <a href=""> Nguyễn Tuấn Anh </a>
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBFooter>
  );
};

export default Footer;
