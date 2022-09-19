import type { NextPage } from "next";

const FooterActiveMobile: NextPage = () => {
  return (
    <div className="container mx-0 mw-100 pb-3">
      <div className="row">
        <div className="d-sm-none col-12">
          <button
            className="btn btn-success rounded-5 form-control fw-bold opacity-100"
            disabled
          >
            Nombre de points: 20/60
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterActiveMobile;
