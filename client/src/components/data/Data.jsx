import h1 from "../images/hero/h1.png";
import h2 from "../images/hero/h2.png";
import h3 from "../images/hero/h3.png";
import h4 from "../images/hero/h4.png";
import h6 from "../images/hero/h6.png";
import p1 from "../images/list/p-1.png";
import p2 from "../images/list/p-2.png";
import p3 from "../images/list/p-7.png";
import p4 from "../images/list/p-4.png";
import p5 from "../images/list/p-5.png";
import p6 from "../images/list/p-6.png";
import city1 from "../images/location/city-1.png";
import city2 from "../images/location/city-2.png";
import city3 from "../images/location/city-3.png";
import city4 from "../images/location/city-4.png";
import city5 from "../images/location/city-5.png";
import city6 from "../images/location/city-6.png";
import team1 from "../images/customer/team-1.jpg";
import team2 from "../images/customer/team-3.jpg";
import team3 from "../images/customer/team-2.jpg";
import team4 from "../images/customer/team-4.jpg";
import team5 from "../images/customer/team-5.jpg";
import team6 from "../images/customer/team-6.jpg";
import { FaFacebook, FaInstagram, FaLinkedin, FaTrophy, FaTwitter } from "react-icons/fa"

export const nav = [
  {
    text: "home",
    path: "/",
  },
  {
    text: "about",
    path: "/about",
  },
  // {
  //   text: "blog",
  //   path: "/blog",
  // },
  {
    text: "properties",
    path: "/properties",
  },
  {
    text: "contact",
    path: "/contact",
  },
  {
    text: "search",
    path: "/search",
  },
];
export const featured = [
  {
    cover: h1,
    type: "Family House",
    total: "122 Property",
  },
  {
    cover: h2,
    type: "Villa",
    total: "155 Property",
  },
  {
    cover: h3,
    type: "Apartment",
    total: "300 Property",
  },
  {
    cover: h4,
    type: "Office & Studio",
    total: "80 Property",
  },
  {
    cover: h6,
    type: "Condo",
    total: "80 Property",
  },
];
export const list = [
  {
    id: 1,
    cover: p1,
    name: "Red Carpet Real Estate",
    location: "210 Zirak Road, Canada",
    category: "For Rent",
    price: "$3,700",
    type: "Apartment",
  },
  {
    id: 2,
    cover: p2,
    name: "Fairmount Properties",
    location: "5698 Zirak Road, NewYork",
    category: "For Sale",
    price: "$9,750",
    type: "Condos",
  },
  {
    id: 3,
    cover: p3,
    name: "The Real Estate Corner",
    location: "5624 Mooker Market, USA",
    category: "For Rent",
    price: "$5,860",
    type: "Offices",
  },
  {
    id: 4,
    cover: p4,
    name: "Herringbone Realty",
    location: "5621 Liverpool, London",
    category: "For Sale",
    price: "$7,540",
    type: "Homes & Villas",
  },
  {
    id: 5,
    cover: p5,
    name: "Brick Lane Realty",
    location: "210 Montreal Road, Canada",
    category: "For Rent",
    price: "$4,850",
    type: "Commercial",
  },
  {
    id: 6,
    cover: p6,
    name: "Banyon Tree Realty",
    location: "210 Zirak Road, Canada",
    category: "For Sale",
    price: "$2,742",
    type: "Apartment",
  },
];
export const awards = [
  {
    icon: <i><FaTrophy /></i>,
    num: "32 M	",
    name: "Blue Burmin Award",
  },
  {
    icon: <i><FaTrophy /></i>,
    num: "43 M",
    name: "Mimo X11 Award",
  },
  {
    icon: <i><FaTrophy /></i>,
    num: "51 M",
    name: "Australian UGC Award",
  },
  {
    icon: <i><FaTrophy /></i>,
    num: "42 M",
    name: "IITCA Green Award",
  },
];
export const location = [
  {
    id: 1,
    city: "New Orleans",
    country: "US",
    Villas: "12 Villas",
    Apartments: "10 Apartments",
    Offices: "07 Offices",
    cover: city1,
  },
  {
    id: 2,
    city: "Jersy",
    country: "US",
    Villas: "12 Villas",
    Apartments: "10 Apartments",
    Offices: "07 Offices",
    cover: city2,
  },
  {
    id: 3,
    city: "Liverpool",
    country: "England",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: city3,
  },
  {
    id: 4,
    city: "NewYork",
    country: "US",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: city4,
  },
  {
    id: 5,
    city: "Montreal",
    country: "Canada",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: city5,
  },
  {
    id: 6,
    city: "California",
    country: "US",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: city6,
  },
];
export const team = [
  {
    list: "50",
    cover: team1,
    address: "Liverpool, Canada",
    name: "Mark S. Denvers",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
  {
    list: "70",
    cover: team2,
    address: "Montreal, Canada",
    name: "Harijeet M. Siller",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
  {
    list: "80",
    cover: team3,
    address: "Denver, USA",
    name: "Anna K. Young",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
  {
    list: "51",
    cover: team4,
    address: "2272 Briarwood Drive",
    name: "Michelle A. Walters",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
  {
    list: "42",
    cover: team5,
    address: "2272 Briarwood Drive",
    name: "Michael P. Grimaldo",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
  {
    list: "38",
    cover: team6,
    address: "Montreal, USA",
    name: "Eve K. Jollio",
    icon: [
      <i><FaFacebook /></i>,
      <i><FaLinkedin /></i>,
      <i><FaTwitter /></i>,
      <i><FaInstagram /></i>,
    ],
  },
];
export const price = [
  {
    plan: "Basic",
    price: "29",
    ptext: "per user, per month",
    list: [
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "99.5% Uptime Guarantee",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "120GB CDN Bandwidth",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "5GB Cloud Storage",
      },
      {
        change: "color",
        icon: <i class="fa-solid fa-x"></i>,
        text: "Personal Help Support",
      },
      {
        change: "color",
        icon: <i class="fa-solid fa-x"></i>,
        text: "Enterprise SLA",
      },
    ],
  },
  {
    best: "Best Value",
    plan: "Standard",
    price: "49",
    ptext: "per user, per month",
    list: [
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "99.5% Uptime Guarantee",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "150GB CDN Bandwidth",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "10GB Cloud Storage",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "Personal Help Support",
      },
      {
        change: "color",
        icon: <i class="fa-solid fa-x"></i>,
        text: "Enterprise SLA",
      },
    ],
  },
  {
    plan: "Platinum",
    price: "79",
    ptext: "2 user, per month",
    list: [
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "100% Uptime Guarantee",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "200GB CDN Bandwidth",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "20GB Cloud Storage",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "Personal Help Support",
      },
      {
        icon: <i class="fa-solid fa-check"></i>,
        text: "Enterprise SLA",
      },
    ],
  },
];
export const footer = [
  {
    title: "EXPLORE",
    links: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Properties", path: "/properties" },
      { name: "Contact", path: "/contact" },
    ],
  },
  {
    title: "QUICK LINKS",
    links: [
      { name: "Search Property", path: "/search" },
      { name: "My Profile", path: "/profile-page" },
      { name: "Favorites", path: "/favourites" },
      { name: "My Cart", path: "/cart" },
    ],
  },
];
