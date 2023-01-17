import React from "react";

export default function GithubLink() {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "black",
        top: "100%",
        width: "100%",
      }}
    >
      <a
        style={{ color: "white" }}
        href="https://github.com/SagarDalal15/nextjs-authentication"
      >
        See code on Github {"->"}
      </a>
    </div>
  );
}
