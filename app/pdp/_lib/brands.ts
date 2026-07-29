import type { BrandChrome } from "./chrome";

/**
 * Per-brand chrome, scraped from each sub-company's live site (footer columns,
 * copyright, phone). Accent colors are approximate brand blues/reds — refine
 * against real brand assets when available.
 */

export const BRANDS: Record<string, BrandChrome> = {
  carrier: {
    key: "carrier",
    name: "Carrier Enterprise",
    accent: "#3d2762",
    nav: [
      "Residential Equipment",
      "Commercial Equipment",
      "Ductless",
      "Indoor Air Quality",
      "Parts",
      "Supplies",
      "Thermostats / Controls / Zoning",
      "Specials",
    ],
    footerColumns: [
      { title: "Company", links: ["About", "Branches", "Careers", "Mobile Apps"] },
      { title: "Resources", links: ["CE PATH", "Clearance", "Credit Application", "Ductless Hybrid Tech", "IAQ", "Inflation Reduction Act", "Refrigerant Reclaim", "Refrigerant Transition", "Scratch & Dent", "SEER2", "Special Order", "Strategic Accounts", "Training", "Videos"] },
      { title: "Local", links: ["Dealer Resources", "QTrac"] },
      { title: "CE Tools", links: ["Overview", "CE Pay", "CE Punchout", "CE Rewards", "CE Statements", "EasyStock", "Rebates", "Service Express"] },
      { title: "Watsco Tools", links: ["Overview", "Amply", "Housecall Pro", "OnCall Air"] },
      { title: "Support", links: ["Chat", "Contact", "Help Center", "Returns", "Shipping", "Tutorials", "Wingman"] },
    ],
    copyright: "2026 CE. All rights reserved.",
  },
  homans: {
    key: "homans",
    name: "Homans Associates",
    accent: "#003874",
    nav: [
      "Products",
      "Brands",
      "Specials",
      "Services",
      "Find A Local Dealer",
      "Resources",
      "Training & Events",
    ],
    footerColumns: [
      { title: "Company", links: ["About", "Branches", "Careers", "Mobile Apps"] },
      { title: "Local", links: ["Bryant Resources", "Mitsubishi Team", "Simple Proposal"] },
      { title: "Resources", links: ["Credit Application", "Homans Pay", "Watsco Tools", "Rebates"] },
      { title: "Customer Service", links: ["Help", "Shipping", "Returns", "Contact Support"] },
    ],
    copyright: "2026 Homans Associates. All rights reserved.",
  },
  dcne: {
    key: "dcne",
    name: "DCNE",
    accent: "#124b8f",
    phone: "781-322-8800",
    nav: [
      "Shop Residential",
      "Shop Commercial",
      "Parts",
      "Supplies",
      "Scratch and Dent",
      "Brands",
      "Quick Order",
    ],
    footerColumns: [
      { title: "Products", links: ["Residential", "Commercial", "Parts", "Supplies", "Line Card"] },
      { title: "Account", links: ["COD Application", "Line of Credit Application", "Rebate Calculator"] },
      { title: "Company", links: ["About Us", "Branch Locations", "Contact Us", "Careers"] },
      { title: "Resources", links: ["Warranty", "Training Classes", "Return Policy", "Privacy Policy"] },
    ],
    copyright: "DCNE. All rights reserved.",
  },
  ecmdi: {
    key: "ecmdi",
    name: "East Coast Metal Distributors",
    accent: "#cb0015",
    nav: [
      "Categories",
      "Brands",
      "PRO Guides",
      "About Us",
      "Quick Order",
      "Warranty Search",
      "Parts List & Documents",
    ],
    footerColumns: [
      { title: "Company", links: ["About Us", "Locations", "Careers", "Contact Us"] },
      { title: "Sales & Ordering", links: ["Payment & Delivery", "Credit App", "Dockside Pickup", "Return Policy", "Accessibility"] },
      { title: "Shopping Tools", links: ["Order Templates", "Quick Order", "HVAC Pro+ Mobile App", "SimpleOrder", "SimpleStock", "SimpleProposal", "Promotions"] },
      { title: "Resources", links: ["Our Blog", "Using Our Website", "Wingman", "PRO Training", "PRO Training Events", "Contractor Tools", "Homeowner Financing"] },
    ],
    copyright: "2026 East Coast Metal Distributors. All Rights Reserved.",
  },
  peirce: {
    key: "peirce",
    name: "Peirce-Phelps",
    accent: "#00539b",
    phone: "1 (800) 342-2304",
    nav: [
      "Specials",
      "Find A Local Dealer",
      "Products",
      "Brands",
      "Services",
      "Resources",
      "Training & Events",
    ],
    footerColumns: [
      { title: "Company", links: ["About Us", "History", "Careers", "Partners"] },
      { title: "Account", links: ["My Account", "Quick Order", "My Lists", "Pay & View Invoices"] },
      { title: "Resources", links: ["Warranty Center", "Store Locator", "Help & Support"] },
      { title: "Contact Us", links: ["New Dealer Registration", "Customer Finance", "Sitemap"] },
    ],
    copyright: "2026 Peirce-Phelps, LLC. All Rights Reserved.",
  },
  baker: {
    key: "baker",
    name: "Baker Distributing",
    accent: "#c8102e",
    phone: "(800) 217-4698",
    nav: [
      "HVAC",
      "Refrigeration",
      "Foodservice",
      "Parts",
      "Compressors",
      "Motors",
      "Indoor Air Quality",
      "Thermostats",
      "Tools",
      "Supplies",
    ],
    footerColumns: [
      { title: "All Product Lines", links: ["HVAC", "Residential HVAC", "Commercial HVAC", "Refrigeration", "Foodservice", "Parts", "Supplies"] },
      { title: "Sales & Ordering", links: ["Ordering", "Sales Centers", "Sales Team", "eCommerce Sales", "Distribution Centers", "National Accounts", "Online Rewards", "Returns & Exchanges", "Shipments & Deliveries", "Special Orders", "Curbside Express", "Baker Express", "Smart Stock"] },
      { title: "Customer Service & Support", links: ["Customer Service", "Emergency & After Hours", "eCommerce Support", "HVAC Technical Support", "Credit Support", "FAQ", "BakerPay", "Credit Card Retention Policy"] },
      { title: "Resources", links: ["About Us", "Company News", "Brand Portfolio", "Careers", "Contact Us", "DOE Regulations", "eCommerce Help", "Events Calendar", "Customer Financing", "Go Green", "History", "Industry Segments", "Leadership", "Locate Store", "Technology Tools", "Timeline", "Privacy Policy", "Terms and Conditions", "Accessibility", "Warranties"] },
    ],
    copyright: "Baker Distributing Company LLC. All Rights Reserved.",
  },
  gemaire: {
    key: "gemaire",
    name: "Gemaire",
    accent: "#0080df",
    phone: "(888) 601-0038",
    nav: [
      "Shop for Products",
      "Brands",
      "Resources",
      "Quick Order",
      "Matched Systems",
    ],
    footerColumns: [
      { title: "About", links: ["About Gemaire", "About Heating And Cooling Supply", "Branch Finder", "Careers"] },
      { title: "External Resources", links: ["Apply for Gemaire Credit", "Apply for Gemaire COD Account", "GemPay"] },
      { title: "Support", links: ["Help", "Shipping", "Returns", "Sales Tax Disclosures", "Accessibility", "FAQ"] },
      { title: "Contact Us", links: ["support@gemaire.com", "(888) 601–0038"] },
    ],
    copyright: "2026 Gemaire Distributors LLC. All Rights Reserved.",
  },
};

export function getBrand(key: string): BrandChrome | undefined {
  return BRANDS[key];
}
