import moment from "moment";

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT; //! Change back to REACT_APP_API_ENDPOINT when finished

export const reducerHooks = (state, newState) => ({
  ...state,
  ...newState,
});

export const formatDateFE = "MMMM DD, YYYY";
export const formatDateBE = "YYYY-MM-DD";

function timeConvert(n) {
  var num = n;
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  if (rhours === 0) {
    return num + " minutes";
  }
  return rhours + " hour(s) and " + rminutes + " minute(s).";
}

export const convertExperience = (input) => {
  const result = input.map((item) => {
    let output = {
      id: item.id,
      title: item.title,
      imgLink: item.images[0],
      category: item.categoryName,
      catoryIcon: "",
      time: formatMinutesToHours(item.duration),
      price: `$ ${item.price}`,
    };

    return output;
  });

  return result;
};

export const getQueryParams = () =>
  window.location.search
    .replace("?", "")
    .split("&")
    .reduce(
      (r, e) => ((r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1])), r),
      {}
    );

export function formatMinutesToHours(numberOfMinutes) {
  //create duration object from moment.duration
  var duration = moment.duration(numberOfMinutes, "minutes");

  //calculate hours
  var hh =
    duration.years() * (365 * 24) +
    duration.months() * (30 * 24) +
    duration.days() * 24 +
    duration.hours();

  //get minutes
  var mm = duration.minutes();

  if (hh === 0) {
    if (mm === 1) {
      return mm + " minute";
    }
    return mm + " minutes";
  } else {
    if (mm === 0) {
      if (hh === 1) {
        return hh + " hour";
      }
      return hh + " hours";
    }
    if (hh === 1) {
      return hh + " hour " + mm + " minutes";
    }
    return hh + " hours " + mm + " minutes";
  }
}
