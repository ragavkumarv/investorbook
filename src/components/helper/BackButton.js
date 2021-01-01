import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useWindowSize } from "./Command";

export const BackButton = ({ content, display, marginTop }) => {
  const size = useWindowSize();
  const small = size.width < 550;
  const homePaths = ["/", "/investors", "/companies"];
  const history = useHistory();
  const location = useLocation();
  return display ? (
    <div
      style={{
        display: "flex",
        marginBottom: "10px",
        alignItems: "start",
        gap: "10px",
      }}
    >
      {homePaths.find((path) => location.pathname === path) ? (
        ""
      ) : (
          <IconButton
            aria-label="back"
            style={{
              marginTop,
            }}
            onClick={() => history.goBack()}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
        )}

      {content}
    </div>
  ) : (
      <>{content}</>
    );
};
