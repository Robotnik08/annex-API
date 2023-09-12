/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

import fetch from "node-fetch";

// root function for the result
export class ResponseHandler {
  handler(req, res, next) {
    // get the result from the request and send it back to the client, implement in the future

    const url = //api variables
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg",
      },
    };

    fetch(url, options) // fetch the data from the API
      .then((res) => res.json())
      .then((json) => {
        info_main(json);
      })
      .catch((err) => console.error("error:" + err));

    // send an test JSON object

    function info_main(json_main) {
      const url_details =
        "https://api.themoviedb.org/3/movie/" +
        json_main.results[0].id +
        "?language=en-US";
      const options_details = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg",
        },
      };

      fetch(url_details, options_details)
        .then((res) => res.json())
        .then((json) => info_details(json))
        .catch((err) => console.error("error:" + err));

      function info_details(json_details) {


        const url_credit =
          "https://api.themoviedb.org/3/movie/" + json_main.results[0].id + "/credits?language=en-US";
        const options_credit = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg",
          },
        };

        fetch(url_credit, options_credit)
          .then((res) => res.json())
          .then((json) => info_credit(json))
          .catch((err) => console.error("error:" + err));

        function info_credit(json_credit) {
          let out;
          for (let i = 0; i < json_credit.cast.length; i++) {
            out += json_details;
            out += "<br>";
          }
          res.send(out);
        }
      }
    }
  }
}
