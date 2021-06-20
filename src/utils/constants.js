const PORT = process.env.PORT || 4000;

const STATUS = {
  UNVERIFIED: "unVerified",
  PHONEVERIFIED: "phoneVerified",
  CREATED: "created",
  ADDRESSADDED: "addressAdded",
  NICVERIFIED: "nicVerified",
  READYDOSE1: "readyForDose1",
  READYDOSE2: "readyForDose2",
  OPTEDIN: "optedIn",
  NICVERIFIED: "nicVerified",
  VACCINATED: "vaccinated",
};

const PDFOPTIONS = {
  1: "qrcode",
  2: "enrollment",
  3: "firstAppointment",
  4: "firstDose",
  5: "secondAppointment",
  6: "secondDose",
  7: "vaccinated",
};
const UNDERTAKINGS = {
  stepOne: "Eligiblity",
  stepTwo: "General",
  stepThree: "Co-Morbidity",
};
const COUNTRYCODE = {
  SRILANKA: "94",
  INDIA: "91",
};
module.exports = {
  PORT,
  STATUS,
  COUNTRYCODE,
  UNDERTAKINGS,
  PDFOPTIONS
};
