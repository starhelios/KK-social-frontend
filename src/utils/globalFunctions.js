import React from "react";
import MusicIcon from "../assets/img/filter-icons/music";
import SportsIcon from "../assets/img/filter-icons/sports";
import ChefIcon from "../assets/img/filter-icons/chef";
import SurfingIcon from "../assets/img/filter-icons/surfing";

export const determineIcon = (category) => {
  switch (category) {
    case "Cooking":
      return <ChefIcon />;
    case "Sports":
      return <SportsIcon />;
    case "Music":
      return <MusicIcon />;
    case "Surfing":
      return <SurfingIcon />;
  }
};
