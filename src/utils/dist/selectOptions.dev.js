"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTimeZonesOptions = exports.uselocationOptions = exports.usestatusOptions = exports.useDepartmentOptions = exports.useEmployeTypeOptions = exports.useCurrentyAvailabilityOptions = exports.useAvailabilityOptions = exports.usePositionOptions = exports.useCurrencyOptions = exports.useIndustryTypeOptions = exports.useSkillCategoryOptions = exports.useIndustryOptions = exports.useWorkLocationOptions = exports.useJobTypeOptions = exports.useRoleOptions = exports.useProficiencyOptions = exports.usePronounOptions = exports.useGenderOptions = void 0;

var _nextIntl = require("next-intl");

var useGenderOptions = function useGenderOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.profile");
  return [{
    label: "".concat(t("genderOption.woman")),
    value: "Woman"
  }, {
    label: "".concat(t("genderOption.male")),
    value: "Male"
  }, {
    label: "".concat(t("genderOption.nonbinary")),
    value: "Non-binary"
  }, {
    label: "".concat(t("genderOption.transwoman")),
    value: "Trans woman"
  }, {
    label: "".concat(t("genderOption.transman")),
    value: "Trans Man"
  }, {
    label: "".concat(t("genderOption.intersex")),
    value: "Intersex"
  }, {
    label: "".concat(t("genderOption.Agender")),
    value: "Agender"
  }, {
    label: "".concat(t("genderOption.genderqueergenderfluid")),
    value: "Genderqueer / Genderfluid"
  }, {
    label: "".concat(t("genderOption.twospirit")),
    value: "Two-Spirit (for Indigenous communities)"
  }, {
    label: "".concat(t("genderOption.diverse")),
    value: "Diverse"
  }, {
    label: "".concat(t("genderOption.prefersay")),
    value: "Prefers to say"
  }];
};

exports.useGenderOptions = useGenderOptions;

var usePronounOptions = function usePronounOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.profile");
  return [{
    label: "".concat(t("pronounOption.sheher")),
    value: "She/her"
  }, {
    label: "".concat(t("pronounOption.hehim")),
    value: "He/him"
  }, {
    label: "".concat(t("pronounOption.theythem")),
    value: "They/them"
  }, {
    label: "".concat(t("pronounOption.shethey")),
    value: "She/they"
  }, {
    label: "".concat(t("pronounOption.hethey")),
    value: "He/they"
  }, {
    label: "".concat(t("pronounOption.xe")),
    value: "Xe/Xem"
  }, {
    label: "".concat(t("genderOption.prefersay")),
    value: "Prefers to say"
  }];
};

exports.usePronounOptions = usePronounOptions;

var useProficiencyOptions = function useProficiencyOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.education");
  return [{
    label: "".concat(t("proficiencyOptions.beginner")),
    value: "Beginner"
  }, {
    label: "".concat(t("proficiencyOptions.intermediate")),
    value: "Intermediate"
  }, {
    label: "".concat(t("proficiencyOptions.advanced")),
    value: "Advanced"
  }, {
    label: "".concat(t("proficiencyOptions.expert")),
    value: "Expert"
  }];
};

exports.useProficiencyOptions = useProficiencyOptions;

var useRoleOptions = function useRoleOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.preferences");
  return [{
    label: "".concat(t("jobroleoption.AdministrationHRConsultingCEO")),
    value: "Administration / HR / Consulting / CEO"
  }, {
    label: "".concat(t("jobroleoption.BankingInsurance")),
    value: "Banking / Insurance"
  }, {
    label: "".concat(t("jobroleoption.ConstructionArchitectureEngineering")),
    value: "Construction / Architecture / Engineering"
  }, {
    label: "".concat(t("jobroleoption.SecurityPoliceCustomsEmergencyServices")),
    value: "Security / Police / Customs / Emergency Services"
  }, {
    label: "".concat(t("jobroleoption.ChemistryPharmaceuticalsBiotechnology")),
    value: "Chemistry / Pharmaceuticals / Biotechnology"
  }, {
    label: "".concat(t("jobroleoption.PurchasingLogisticsTrading")),
    value: "Purchasing / Logistics / Trading"
  }, {
    label: "".concat(t("jobroleoption.ElectronicsTechnologyWatches")),
    value: "Electronics / Technology / Watches"
  }, {
    label: "".concat(t("jobroleoption.VehiclesSkilledTradesWarehousingTransportation")),
    value: "Vehicles / Skilled Trades / Warehousing / Transportation"
  }, {
    label: "".concat(t("jobroleoption.FinanceFiduciaryServicesRealEstate")),
    value: "Finance / Fiduciary Services / Real Estate"
  }, {
    label: "".concat(t("jobroleoption.HospitalityFoodTourism")),
    value: "Hospitality / Food / Tourism"
  }, {
    label: "".concat(t("jobroleoption.GraphicDesignTypographyPrinting")),
    value: "Graphic Design / Typography / Printing"
  }, {
    label: "".concat(t("jobroleoption.ITTelecommunications")),
    value: "IT / Telecommunications"
  }, {
    label: "".concat(t("jobroleoption.LawLegal")),
    value: "Law / Legal"
  }, {
    label: "".concat(t("jobroleoption.MarketingCommunicationsEditorial")),
    value: "Marketing / Communications / Editorial"
  }, {
    label: "".concat(t("jobroleoption.MechanicalPlantEngineeringManufacturing")),
    value: "Mechanical / Plant Engineering / Manufacturing"
  }, {
    label: "".concat(t("jobroleoption.MedicineCareTherapy")),
    value: "Medicine / Care / Therapy"
  }, {
    label: "".concat(t("jobroleoption.sportsWellnessCulture")),
    value: "Sports / Wellness / Culture"
  }, {
    label: "".concat(t("jobroleoption.SalesCustomerServiceInternalSales")),
    value: "Sales / Customer Service / Internal Sales"
  }, {
    label: "".concat(t("jobroleoption.PublicAdministrationEducationSocialServices")),
    value: "Public Administration / Education / Social Services"
  }];
};

exports.useRoleOptions = useRoleOptions;

var useJobTypeOptions = function useJobTypeOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.preferences");
  return ["".concat(t("jobtypeoption.full-time")), "".concat(t("jobtypeoption.part-time")), "".concat(t("jobtypeoption.internship")), "".concat(t("jobtypeoption.freelancer")), "".concat(t("jobtypeoption.remotejob"))];
};

exports.useJobTypeOptions = useJobTypeOptions;

var useWorkLocationOptions = function useWorkLocationOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.preferences");
  return [{
    label: "".concat(t("worklocationoption.remote")),
    value: "remote"
  }, {
    label: "".concat(t("worklocationoption.onsite")),
    value: "on-site"
  }, {
    label: "".concat(t("worklocationoption.both")),
    value: "both"
  }];
};

exports.useWorkLocationOptions = useWorkLocationOptions;

var useIndustryOptions = function useIndustryOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.preferences");
  return [{
    label: "".concat(t("industryoption.design")),
    value: "design"
  }, {
    label: "".concat(t("industryoption.development")),
    value: "development"
  }];
};

exports.useIndustryOptions = useIndustryOptions;

var useSkillCategoryOptions = function useSkillCategoryOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.education");
  return [{
    label: "".concat(t("skillCategoryOptions.Technology")),
    value: "Technology"
  }, {
    label: "".concat(t("skillCategoryOptions.Finance")),
    value: "Finance"
  }, {
    label: "".concat(t("skillCategoryOptions.Healthcare")),
    value: "Healthcare"
  }, {
    label: "".concat(t("skillCategoryOptions.Education")),
    value: "Education"
  }, {
    label: "".concat(t("skillCategoryOptions.MediaEntertainment")),
    value: "Media & Entertainment"
  }, {
    label: "".concat(t("skillCategoryOptions.RetailEcommerce")),
    value: "Retail & E-commerce"
  }, {
    label: "".concat(t("skillCategoryOptions.HospitalityTourism")),
    value: "Hospitality & Tourism"
  }, {
    label: "".concat(t("skillCategoryOptions.GovernmentPublicSector")),
    value: "Government & Public Sector"
  }, {
    label: "".concat(t("skillCategoryOptions.NonprofitSocialImpact")),
    value: "Non-profit & Social Impact"
  }, {
    label: "".concat(t("skillCategoryOptions.Legal")),
    value: "Legal"
  }, {
    label: "".concat(t("skillCategoryOptions.ConstructionRealEstate")),
    value: "Construction & Real Estate"
  }, {
    label: "".concat(t("skillCategoryOptions.ManufacturingElectronics")),
    value: "Manufacturing Electronics"
  }, {
    label: "".concat(t("skillCategoryOptions.EnergyUtilities")),
    value: "Energy & Utilities"
  }, {
    label: "".concat(t("skillCategoryOptions.TransportationLogistics")),
    value: "Transportation & Logistics"
  }, {
    label: "".concat(t("skillCategoryOptions.ConsultingBusinessServices")),
    value: "Consulting & Business Services"
  }, {
    label: "".concat(t("skillCategoryOptions.ScienceResearch")),
    value: "Science & Research"
  }, {
    label: "".concat(t("skillCategoryOptions.MarketingAdvertising")),
    value: "Marketing & Advertising"
  }, {
    label: "".concat(t("skillCategoryOptions.AgricultureFood")),
    value: "Agriculture & Food"
  }, {
    label: "".concat(t("skillCategoryOptions.GamingInteractiveMedia")),
    value: "Gaming & Interactive Media"
  }, {
    label: "".concat(t("skillCategoryOptions.BeautyWellness")),
    value: "Beauty & Wellness"
  }];
};

exports.useSkillCategoryOptions = useSkillCategoryOptions;

var useIndustryTypeOptions = function useIndustryTypeOptions() {
  var t = (0, _nextIntl.useTranslations)("CompanyProfile.industry");
  return [{
    label: "".concat(t("industryOption.technology")),
    value: "Technology"
  }, {
    label: "".concat(t("industryOption.finance")),
    value: "Finance"
  }, {
    label: "".concat(t("industryOption.healthcare")),
    value: "Healthcare"
  }, {
    label: "".concat(t("industryOption.education")),
    value: "Education"
  }, {
    label: "".concat(t("industryOption.mediaEntertainment")),
    value: "Media & Entertainment"
  }, {
    label: "".concat(t("industryOption.retailEcommerce")),
    value: "Retail & E-commerce"
  }, {
    label: "".concat(t("industryOption.hospitalityTourism")),
    value: "Hospitality & Tourism"
  }, {
    label: "".concat(t("industryOption.governmentPublicSector")),
    value: "Government & Public Sector"
  }, {
    label: "".concat(t("industryOption.nonprofitSocialImpact")),
    value: "Non-profit & Social Impact"
  }, {
    label: "".concat(t("industryOption.legal")),
    value: "Legal"
  }, {
    label: "".concat(t("industryOption.constructionRealEstate")),
    value: "Construction & Real Estate"
  }, {
    label: "".concat(t("industryOption.manufacturingElectronics")),
    value: "Manufacturing Electronics"
  }, {
    label: "".concat(t("industryOption.energyUtilities")),
    value: "Energy & Utilities"
  }, {
    label: "".concat(t("industryOption.transportationLogistics")),
    value: "Transportation & Logistics"
  }, {
    label: "".concat(t("industryOption.consultingBusinessServices")),
    value: "Consulting & Business Services"
  }, {
    label: "".concat(t("industryOption.scienceResearch")),
    value: "Science & Research"
  }, {
    label: "".concat(t("industryOption.marketingAdvertising")),
    value: "Marketing & Advertising"
  }, {
    label: "".concat(t("industryOption.agricultureFood")),
    value: "Agriculture & Food"
  }, {
    label: "".concat(t("industryOption.gamingInteractiveMedia")),
    value: "Gaming & Interactive Media"
  }, {
    label: "".concat(t("industryOption.beautyWellness")),
    value: "Beauty & Wellness"
  }];
};

exports.useIndustryTypeOptions = useIndustryTypeOptions;

var useCurrencyOptions = function useCurrencyOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile");
  return [{
    value: "USD",
    label: "USD ($) ".concat(t("currency.usd") || "USD")
  }, {
    value: "EUR",
    label: "EUR (\u20AC) ".concat(t("currency.eur") || "EUR")
  }, {
    value: "GBP",
    label: "GBP (\xA3) ".concat(t("currency.gbp") || "GBP")
  }, {
    value: "INR",
    label: "INR (\u20B9) ".concat(t("currency.inr") || "INR")
  }, {
    value: "AED",
    label: "AED (\u062F.\u0625) ".concat(t("currency.aed") || "AED")
  }, {
    value: "CAD",
    label: "CAD (C$) ".concat(t("currency.cad") || "CAD")
  }, {
    value: "AUD",
    label: "AUD (A$) ".concat(t("currency.aud") || "AUD")
  }, {
    value: "JPY",
    label: "JPY (\xA5) ".concat(t("currency.jpy") || "JPY")
  }, {
    value: "CHF",
    label: "CHF (\u20A3) ".concat(t("currency.chf") || "CHF")
  }, {
    value: "NZD",
    label: "NZD (NZ$) ".concat(t("currency.nzd") || "NZD")
  }, {
    value: "RUB",
    label: "RUB (\u20BD) ".concat(t("currency.rub") || "RUB")
  }, {
    value: "ZAR",
    label: "ZAR (R) ".concat(t("currency.zar") || "ZAR")
  }, {
    value: "MXN",
    label: "MXN (MX$) ".concat(t("currency.mxn") || "MXN")
  }, {
    value: "BRL",
    label: "BRL (R$) ".concat(t("currency.brl") || "BRL")
  }, {
    value: "ARS",
    label: "ARS ($) ".concat(t("currency.ars") || "ARS")
  }, {
    value: "CLP",
    label: "CLP ($) ".concat(t("currency.clp") || "CLP")
  }, {
    value: "COP",
    label: "COP ($) ".concat(t("currency.cop") || "COP")
  }, {
    value: "PEN",
    label: "PEN (S/) ".concat(t("currency.pen") || "PEN")
  }, {
    value: "UYU",
    label: "UYU ($) ".concat(t("currency.uyu") || "UYU")
  }, {
    value: "PYG",
    label: "PYG (\u20B2) ".concat(t("currency.pyg") || "PYG")
  }, {
    value: "VEF",
    label: "VEF (Bs.S) ".concat(t("currency.vef") || "VEF")
  }, {
    value: "VND",
    label: "VND (\u20AB) ".concat(t("currency.vnd") || "VND")
  }, {
    value: "ZMW",
    label: "ZMW (K) ".concat(t("currency.zmw") || "ZMW")
  }, {
    value: "XOF",
    label: "XOF (CFA) ".concat(t("currency.xof") || "XOF")
  }, {
    value: "XAF",
    label: "XAF (FCFA) ".concat(t("currency.xaf") || "XAF")
  }];
};

exports.useCurrencyOptions = useCurrencyOptions;

var usePositionOptions = function usePositionOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.education");
  return [{
    label: "".concat(t("positionOption.senior")),
    value: "Senior"
  }, {
    label: "".concat(t("positionOption.mid")),
    value: "Mid"
  }, {
    label: "".concat(t("positionOption.junior")),
    value: "Junior"
  }, {
    label: "".concat(t("positionOption.intern")),
    value: "Intern"
  }, {
    label: "".concat(t("positionOption.volunteer")),
    value: "Volunteer"
  }, {
    label: "".concat(t("positionOption.freelancer")),
    value: "Freelancer"
  }, {
    label: "".concat(t("positionOption.manager")),
    value: "Manager"
  }, {
    label: "".concat(t("positionOption.director")),
    value: "Director"
  }];
};

exports.usePositionOptions = usePositionOptions;

var useAvailabilityOptions = function useAvailabilityOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.profile");
  return [{
    label: "\uD83D\uDFE2 ".concat(t("availabilityOption.openToWork")),
    value: "Open to Work"
  }, {
    label: "\uD83D\uDFE1 ".concat(t("availabilityOption.freelance")),
    value: "Available for Freelance"
  }, {
    label: "\uD83D\uDD34 ".concat(t("availabilityOption.notavailable")),
    value: "Not Available"
  }, {
    label: "\uD83C\uDF0D ".concat(t("availabilityOption.worldwide")),
    value: " Open for Remote Worldwide"
  }];
};

exports.useAvailabilityOptions = useAvailabilityOptions;

var useCurrentyAvailabilityOptions = function useCurrentyAvailabilityOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile.profile");
  return [{
    label: "".concat(t("availabilityOption.immediately")),
    value: "immediately"
  }, {
    label: "".concat(t("availabilityOption.in1Week")),
    value: "1 week"
  }, {
    label: "".concat(t("availabilityOption.in2Weeks")),
    value: "2 weeks"
  }, {
    label: "".concat(t("availabilityOption.in1Month")),
    value: "1 month"
  }, {
    label: "".concat(t("availabilityOption.negotiable")),
    value: "2 month"
  }];
};

exports.useCurrentyAvailabilityOptions = useCurrentyAvailabilityOptions;

var useEmployeTypeOptions = function useEmployeTypeOptions() {
  var t = (0, _nextIntl.useTranslations)("CreateCompanyJob.employeetype");
  return [{
    label: "".concat(t("fullTime")),
    value: "fullTime"
  }, {
    label: "".concat(t("partTime")),
    value: "partTime"
  }, {
    label: "".concat(t("temporary")),
    value: "temporary"
  }, {
    label: "".concat(t("contract")),
    value: "contract"
  }, // { label: `${t("volunteer")}`, value: "volunteer" },
  {
    label: "".concat(t("internship")),
    value: "internship"
  }, {
    label: "".concat(t("freelance")),
    value: "freelance"
  }];
};

exports.useEmployeTypeOptions = useEmployeTypeOptions;

var useDepartmentOptions = function useDepartmentOptions() {
  var t = (0, _nextIntl.useTranslations)("CreateCompanyJob.department");
  return [{
    label: "".concat(t("engineering")),
    value: "Engineering"
  }, {
    label: "".concat(t("it")),
    value: "it"
  }, {
    label: "".concat(t("marketingCommunications")),
    value: "marketing_communications"
  }, {
    label: "".concat(t("salesBusinessDevelopment")),
    value: "sales_business_development"
  }, {
    label: "".concat(t("productManagement")),
    value: "product_management"
  }, {
    label: "".concat(t("customerSupport")),
    value: "customer_support"
  }, {
    label: "".concat(t("hr")),
    value: "hr"
  }, {
    label: "".concat(t("financeAccounting")),
    value: "finance_accounting"
  }, {
    label: "".concat(t("legalCompliance")),
    value: "legal_compliance"
  }, {
    label: "".concat(t("designUx")),
    value: "design_ux"
  }, {
    label: "".concat(t("operationsLogistics")),
    value: "operations_logistics"
  }, {
    label: "".concat(t("healthcareServices")),
    value: "healthcare_services"
  }, {
    label: "".concat(t("researchDevelopment")),
    value: "research_development"
  }, {
    label: "".concat(t("educationTraining")),
    value: "education_training"
  }, {
    label: "".concat(t("securityRiskManagement")),
    value: "security_risk_management"
  }, {
    label: "".concat(t("executiveLeadership")),
    value: "executive_leadership"
  }];
};

exports.useDepartmentOptions = useDepartmentOptions;

var usestatusOptions = function usestatusOptions() {
  return [{
    label: "All Status",
    value: "All Status"
  }, {
    label: "Open",
    value: "Open"
  }, {
    label: "Closed",
    value: "Closed"
  }, {
    label: "In Progress",
    value: "In Progress"
  }];
};

exports.usestatusOptions = usestatusOptions;

var uselocationOptions = function uselocationOptions() {
  return [{
    label: "All Location",
    value: "All Location"
  }, {
    label: "New York",
    value: "New York"
  }, {
    label: "Los Angeles",
    value: "Los Angeles"
  }, {
    label: "Chicago",
    value: "Chicago"
  }];
};

exports.uselocationOptions = uselocationOptions;

var useTimeZonesOptions = function useTimeZonesOptions() {
  var t = (0, _nextIntl.useTranslations)("UserProfile");
  return [{
    label: "UTC (GMT)",
    value: "UTC"
  }, {
    label: "Asia/Kolkata (IST)",
    value: "Asia/Kolkata"
  }, {
    label: "US/Eastern (EST/EDT)",
    value: "US/Eastern"
  }, {
    label: "US/Pacific (PST/PDT)",
    value: "US/Pacific"
  }, {
    label: "US/Central (CST/CDT)",
    value: "US/Central"
  }, {
    label: "Europe/London (GMT/BST)",
    value: "Europe/London"
  }, {
    label: "Europe/Paris (CET/CEST)",
    value: "Europe/Paris"
  }, {
    label: "Europe/Berlin (CET/CEST)",
    value: "Europe/Berlin"
  }, {
    label: "Asia/Tokyo (JST)",
    value: "Asia/Tokyo"
  }, {
    label: "Asia/Shanghai (CST)",
    value: "Asia/Shanghai"
  }, {
    label: "Asia/Singapore (SGT)",
    value: "Asia/Singapore"
  }, {
    label: "Asia/Dubai (GST)",
    value: "Asia/Dubai"
  }, {
    label: "Australia/Sydney (AEST/AEDT)",
    value: "Australia/Sydney"
  }, {
    label: "Pacific/Auckland (NZST/NZDT)",
    value: "Pacific/Auckland"
  }, {
    label: "America/Sao_Paulo (BRT/BRST)",
    value: "America/Sao_Paulo"
  }, {
    label: "Africa/Johannesburg (SAST)",
    value: "Africa/Johannesburg"
  }, {
    label: "Africa/Cairo (EET/EEST)",
    value: "Africa/Cairo"
  }, {
    label: "Asia/Seoul (KST)",
    value: "Asia/Seoul"
  }, {
    label: "Asia/Jakarta (WIB)",
    value: "Asia/Jakarta"
  }, {
    label: "Canada/Eastern (EST/EDT)",
    value: "Canada/Eastern"
  }];
};

exports.useTimeZonesOptions = useTimeZonesOptions;