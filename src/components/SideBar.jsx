import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import { useGlobalContext } from "../contexts";
import {
  MdHome,
  MdAccountCircle,
  // MdOutlineAccountBalance,
} from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";
export default function SideBar() {
  const navigate = useNavigate();
  const { collapsed, setCollapsed, isArabic } = useGlobalContext();
  const SideBarData = [
    {
      title: isArabic ? "الرئيسية" : "Home",
      icon: <MdHome style={{ width: "2rem", height: "2rem" }} />,
      link: "/",
    },
    {
      title: isArabic ? "السيارات" : "Autos",
      icon: <IoCarSportSharp style={{ width: "2rem", height: "2rem" }} />,
      link: "/autos",
    },
    {
      title: isArabic ? "المزايدة" : "Bidding",
      icon: <BiDollar style={{ width: "2rem", height: "2rem" }} />,
      link: "/bidding",
    },
    {
      title: isArabic ? "الزبائن" : "Clients",
      icon: <MdAccountCircle style={{ width: "2rem", height: "2rem" }} />,
      link: "/clients",
    },
    // {
    //   title: "المحاسبة",
    //   icon: (
    //     <MdOutlineAccountBalance style={{ width: "2rem", height: "2rem" }} />
    //   ),
    //   link: "/finance",
    // },
  ];
  return (
    <div className={collapsed ? "SideBar SideBar-collapsed" : "SideBar"}>
      <ul className="SideBarList">
        {SideBarData.map((v, i) => (
          <li
            id={window.location.pathname === v.link ? "active" : ""}
            onClick={() => navigate(v.link)}
            className={"row" + (isArabic ? " flexRowReversed" : "")}
            key={i}
          >
            <div className="icon">{v.icon}</div>
            <div className={collapsed ? "title title-collapsed" : "title"}>
              {v.title}
            </div>
          </li>
        ))}
      </ul>
      {/* <li
        id="collapse"
        onClick={() => setIsArabic((e) => !e)}
        className={"row" + (isArabic ? " flexRowReversed" : "")}
      >
        <div className="icon">
          <BiGlobe size={30} />
        </div>
        <div className={collapsed ? "title title-collapsed" : "title"}>
          {isArabic ? "English" : "عربي"}
        </div>
      </li> */}
      {/* <li
        id="collapse"
        onClick={() => logout()}
        className={"row" + (isArabic ? " flexRowReversed" : "")}
      >
        <div
          className="icon"
          style={isArabic ? { transform: "rotateZ(-180deg)" } : {}}
        >
          <BiLogOut size={30} />
        </div>
        <div className={collapsed ? "title title-collapsed" : "title"}>
          {isArabic ? "الخروج" : "Logout"}
        </div>
      </li> */}
      <li
        id="collapse"
        onClick={() => setCollapsed((v) => !v)}
        className={"row" + (isArabic ? " flexRowReversed" : "")}
      >
        <div className={collapsed ? "icon icon-collapsed" : "icon"}>
          {isArabic ? (
            <BsArrowRightCircleFill size={30} />
          ) : (
            <BsArrowLeftCircleFill size={30} />
          )}
        </div>
        <div className={collapsed ? "title title-collapsed" : "title"}>
          {isArabic ? "تصغير" : "Collapse"}
        </div>
      </li>
    </div>
  );
}
